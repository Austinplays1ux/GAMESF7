
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertGameTagSchema, type GameWithDetails, User } from "@shared/schema";
import { z } from "zod";

// Type augmentation for Express Request to include session user
declare module "express-session" {
  interface SessionData {
    user: User;
    userId: number;
    isAuthenticated: boolean;
  }
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
      const { username, password: inputPassword } = req.body;
      
      if (!username || !inputPassword) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Get user from storage
      const user = await storage.getUserByUsername(username);
      
      // Check if user exists and password matches
      if (!user || user.password !== inputPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Check if user is crystalgamer77 and add admin privileges
      const { password: _, ...userWithoutPassword } = user;
      const userData = {
        ...userWithoutPassword,
        isAdmin: user.username === 'crystalgamer77',
        isOwner: user.username === 'crystalgamer77',
      };

      // Set up session with user information
      if (req.session) {
        req.session.user = userData as User;
        req.session.userId = user.id;
        req.session.isAuthenticated = true;
      }

      res.status(200).json(userData);
    } catch (error) {
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
  app.get("/api/user", (req: Request, res: Response) => {
    if (req.session && req.session.isAuthenticated && req.session.user) {
      return res.status(200).json(req.session.user);
    } else {
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
          isAdmin: userData.username === 'crystalgamer77',
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
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(validatedData);
      
      // Also log the user in after registration by setting up the session
      if (req.session) {
        const { password: _, ...userWithoutPassword } = newUser;
        const userData = {
          ...userWithoutPassword,
          isAdmin: newUser.username === 'crystalgamer77',
          isOwner: newUser.username === 'crystalgamer77',
        };
        
        req.session.user = userData as User;
        req.session.userId = newUser.id;
        req.session.isAuthenticated = true;
      }
      
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  return httpServer;
}
