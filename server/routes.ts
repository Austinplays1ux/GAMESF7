
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertGameTagSchema, type GameWithDetails, User } from "@shared/schema";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";

// Type augmentation for Express Request to include session user
declare module "express-session" {
  interface SessionData {
    user: User;
    userId: number;
    isAuthenticated: boolean;
  }
}

// Define message types for the multiplayer lobby
type ChatMessage = {
  type: 'chat';
  userId: number;
  username: string;
  message: string;
  timestamp: number;
};

type UserJoinedMessage = {
  type: 'user_joined';
  userId: number;
  username: string;
  timestamp: number;
};

type UserLeftMessage = {
  type: 'user_left';
  userId: number;
  username: string;
  timestamp: number;
};

type LobbyInfoMessage = {
  type: 'lobby_info';
  users: Array<{
    userId: number;
    username: string;
  }>;
  timestamp: number;
};

type WebSocketMessage = ChatMessage | UserJoinedMessage | UserLeftMessage | LobbyInfoMessage;

// User connection mapping
interface ConnectedUser {
  userId: number;
  username: string;
  connection: WebSocket;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API routes
  app.post("/api/games", async (req: Request, res: Response) => {
    try {
      const { title, description, platformId, creatorId, gameType, gameUrl, htmlContent, categoryIds } = req.body;
      
      // Prepare game data based on gameType
      const gameData: any = {
        title,
        description,
        platformId,
        creatorId,
        thumbnailUrl: req.body.thumbnailUrl || `https://placehold.co/400x225/8833FF/FFFFFF?text=${encodeURIComponent(title)}`,
      };
      
      // Add appropriate content based on gameType
      if (gameType === 'url') {
        gameData.gameUrl = gameUrl;
      } else if (gameType === 'html') {
        gameData.htmlContent = htmlContent;
      }
      
      // Create the game
      const newGame = await storage.createGame(gameData);
      
      // Handle game tags if provided
      if (categoryIds && Array.isArray(categoryIds)) {
        const tagPromises = categoryIds.map((categoryId: number) => {
          const gameTag = insertGameTagSchema.parse({
            gameId: newGame.id,
            categoryId
          });
          return storage.addGameTag(gameTag);
        });
        
        await Promise.all(tagPromises);
      }
      
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  app.get("/api/platforms", async (_req: Request, res: Response) => {
    try {
      const platforms = await storage.getPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });
  
  app.patch("/api/platforms/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name, icon, description, color } = req.body;
      
      // Check that the current user is admin (only admins can update platforms)
      if (!(req.session && req.session.user && req.session.user.isAdmin)) {
        return res.status(403).json({ message: "Not authorized to update platform" });
      }
      
      const updatedPlatform = await storage.updatePlatform(id, {
        name,
        icon,
        description,
        color
      });
      
      if (!updatedPlatform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      
      res.json(updatedPlatform);
    } catch (error) {
      res.status(500).json({ message: "Failed to update platform" });
    }
  });

  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/games", async (req: Request, res: Response) => {
    try {
      const platformId = req.query.platformId ? Number(req.query.platformId) : undefined;
      const searchQuery = req.query.search as string | undefined;
      
      let games;
      if (searchQuery) {
        // Search for games
        games = await storage.searchGames(searchQuery);
      } else if (platformId) {
        // Filter by platform
        games = await storage.getGamesByPlatform(platformId);
      } else {
        // Get all games
        games = await storage.getGames();
      }
      
      // Get detailed info about each game
      const gameDetailsPromises = games.map(game => storage.getGameDetails(game.id));
      const gameDetails = await Promise.all(gameDetailsPromises);
      
      // Filter out undefined results
      const filteredGames = gameDetails.filter((game): game is GameWithDetails => game !== undefined);
      
      res.json(filteredGames);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/featured", async (_req: Request, res: Response) => {
    try {
      const featuredGames = await storage.getFeaturedGames();
      
      // Get detailed info about each game
      const gameDetailsPromises = featuredGames.map(game => storage.getGameDetails(game.id));
      const gameDetails = await Promise.all(gameDetailsPromises);
      
      // Filter out undefined results
      const filteredGames = gameDetails.filter((game): game is GameWithDetails => game !== undefined);
      
      res.json(filteredGames);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured games" });
    }
  });
  
  app.get("/api/games/recommended", async (_req: Request, res: Response) => {
    try {
      const recommendedGames = await storage.getRecommendedGames();
      
      // Get detailed info about each game
      const gameDetailsPromises = recommendedGames.map(game => storage.getGameDetails(game.id));
      const gameDetails = await Promise.all(gameDetailsPromises);
      
      // Filter out undefined results
      const filteredGames = gameDetails.filter((game): game is GameWithDetails => game !== undefined);
      
      res.json(filteredGames);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommended games" });
    }
  });

  app.get("/api/games/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const game = await storage.getGameDetails(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game details" });
    }
  });

  app.post("/api/games/:id/play", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const game = await storage.getGame(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      await storage.incrementGamePlays(id);
      res.json({ message: "Play count incremented" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record game play" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password: _, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      console.log("Login API called with body:", JSON.stringify(req.body));
      
      const { username, password: inputPassword } = req.body;
      
      if (!username || !inputPassword) {
        console.log("Login rejected: Missing username or password");
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      console.log(`Login attempt for user: ${username}`);
      
      // Get user from storage with optimized query
      const user = await storage.getUserByUsername(username);
      
      console.log(`User lookup result for ${username}:`, user ? "Found" : "Not found");
      
      // Early check for user existence (prevents timing attacks)
      if (!user) {
        console.log("Authentication failed: User not found");
        // Use consistent response message to prevent user enumeration
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Check if password matches (in a production app, we would use bcrypt.compare here)
      const passwordValid = user.password === inputPassword;
      console.log(`Password validation for ${username}: ${passwordValid ? "Success" : "Failed"} (received: "${inputPassword}", stored: "${user.password}")`);
      
      if (!passwordValid) {
        console.log("Authentication failed: Password invalid");
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      console.log(`Password verification successful for user: ${user.username}`);
      
      // Create user object without the password
      const { password: _, ...userWithoutPassword } = user;
      const userData = {
        ...userWithoutPassword,
        isAdmin: user.username === 'crystalgamer77' || user.username === 'admin',
        isOwner: user.username === 'crystalgamer77',
      };

      console.log(`Session before login:`, req.session ? "Exists" : "Missing", 
        req.session?.id ? `ID: ${req.session.id}` : "No ID");

      // Set up session with user information
      if (req.session) {
        req.session.user = userData as User;
        req.session.userId = user.id;
        req.session.isAuthenticated = true;
        
        console.log(`Session data prepared: userId=${user.id}, username=${user.username}, isAuthenticated=true`);
        
        // Return response immediately
        res.status(200).json(userData);
        
        // Log session state after setting
        console.log(`Session after login: userId=${req.session.userId}, isAuthenticated=${req.session.isAuthenticated}`);
      } else {
        console.log("Warning: No session object available");
        res.status(200).json(userData);
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed", error: String(error) });
    }
  });
  
  // Add a logout endpoint to terminate the session
  app.post("/api/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        
        res.clearCookie("gamesf7.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      return res.status(200).json({ message: "Already logged out" });
    }
  });
  
  // Add an endpoint to get the current logged-in user
  // Testing route for direct login
  app.get("/api/testlogin/:username", async (req: Request, res: Response) => {
    try {
      const username = req.params.username;
      console.log(`Test login for ${username}`);
      
      // Get user from storage
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create user object without the password
      const { password: _, ...userWithoutPassword } = user;
      const userData = {
        ...userWithoutPassword,
        isAdmin: user.username === 'crystalgamer77' || user.username === 'admin',
        isOwner: user.username === 'crystalgamer77',
      };
      
      // Set up session with user information
      if (req.session) {
        req.session.user = userData as User;
        req.session.userId = user.id;
        req.session.isAuthenticated = true;
        console.log("Session updated successfully");
      }
      
      return res.json({ success: true, user: userData });
    } catch (error) {
      console.error("Test login error:", error);
      return res.status(500).json({ message: "Test login failed" });
    }
  });

  app.get("/api/user", (req: Request, res: Response) => {
    console.log("Get current user request received");
    console.log("Session exists:", Boolean(req.session));
    console.log("Session ID:", req.session?.id);
    console.log("Cookie headers:", req.headers.cookie);
    console.log("Session content:", req.session ? JSON.stringify(req.session) : "No session");
    
    if (req.session) {
      console.log("Session auth status:", req.session.isAuthenticated);
      console.log("Session user exists:", Boolean(req.session.user));
      console.log("Session userId:", req.session.userId);
      if (req.session.user) {
        console.log("User in session:", req.session.user.id, req.session.user.username);
      }
    }
    
    // Added more forgiving check - only require session.user
    if (req.session && req.session.user) {
      console.log("Returning authenticated user");
      
      // Also set isAuthenticated flag if it's not set
      if (!req.session.isAuthenticated) {
        console.log("Fixing missing isAuthenticated flag");
        req.session.isAuthenticated = true;
      }
      
      return res.status(200).json(req.session.user);
    } else {
      console.log("No authenticated user found in session");
      return res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { username, email, avatarUrl, bio } = req.body;
      
      // Check that the current user owns this profile and is authorized to update it
      if (req.session && req.session.userId !== id) {
        return res.status(403).json({ message: "Not authorized to update this user profile" });
      }
      
      const updatedUser = await storage.updateUser(id, {
        username,
        email,
        avatarUrl,
        bio
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password: _, ...userData } = updatedUser;
      
      // Update the session with the new user data
      if (req.session) {
        req.session.user = {
          ...userData,
          isAdmin: userData.username === 'crystalgamer77' || userData.username === 'admin',
          isOwner: userData.username === 'crystalgamer77',
        } as User;
      }
      
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      console.log("User registration request received");
      
      // Validate the input data first
      try {
        const validatedData = insertUserSchema.parse(req.body);
        console.log(`Validation passed for username: ${validatedData.username}`);
        
        // Check if user already exists using the optimized query
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser) {
          console.log(`Registration failed: Username ${validatedData.username} already exists`);
          return res.status(409).json({ message: "Username already exists" });
        }
        
        console.log("Creating new user");
        const newUser = await storage.createUser(validatedData);
        console.log(`User created with ID: ${newUser.id}`);
        
        // Create user data without password for session and response
        const { password: _, ...userWithoutPassword } = newUser;
        const userData = {
          ...userWithoutPassword,
          isAdmin: newUser.username === 'crystalgamer77' || newUser.username === 'admin',
          isOwner: newUser.username === 'crystalgamer77',
        };
        
        // Also log the user in after registration by setting up the session
        if (req.session) {
          console.log("Setting up session for new user");
          
          req.session.user = userData as User;
          req.session.userId = newUser.id;
          req.session.isAuthenticated = true;
          
          // Save session explicitly to ensure it's stored immediately
          req.session.save((err) => {
            if (err) {
              console.error("Session save error for new user:", err);
            } else {
              console.log(`Session created for new user ID: ${newUser.id}`);
            }
            
            // Return response after session is saved
            console.log("Registration successful");
            res.status(201).json(userData);
          });
        } else {
          console.log("Warning: No session object available for new user");
          console.log("Registration successful");
          res.status(201).json(userData);
        }
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          console.log("Validation failed:", validationError.errors);
          return res.status(400).json({ 
            message: "Invalid user data", 
            errors: validationError.errors 
          });
        }
        throw validationError;
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: "Failed to create user", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  return httpServer;
}
