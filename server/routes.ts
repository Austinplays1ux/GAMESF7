import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertGameTagSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API routes
  
  // Auth routes
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Get user from storage
      const user = await storage.getUserByUsername(username);
      
      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Return user data (excluding password)
      const { password: _, ...userData } = user;
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: String(error) });
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
      
      let games;
      if (platformId) {
        games = await storage.getGamesByPlatform(platformId);
      } else {
        games = await storage.getGames();
      }
      
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/featured", async (_req: Request, res: Response) => {
    try {
      const featuredGames = await storage.getFeaturedGames();
      res.json(featuredGames);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured games" });
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

  app.post("/api/games", async (req: Request, res: Response) => {
    try {
      const form = new FormData(req);
      const gameFile = form.get('gameFile') as File;
      const thumbnailFile = form.get('thumbnailFile') as File;
      
      // Handle file uploads using Object Storage
      let gameUrl = form.get('gameUrl') as string;
      let thumbnailUrl = form.get('thumbnailUrl') as string;
      
      if (gameFile) {
        const gameObjectName = `games/${Date.now()}-${gameFile.name}`;
        await storage.uploadFile(gameObjectName, await gameFile.arrayBuffer());
        gameUrl = `/api/storage/${gameObjectName}`;
      }
      
      if (thumbnailFile) {
        const thumbObjectName = `thumbnails/${Date.now()}-${thumbnailFile.name}`;
        await storage.uploadFile(thumbObjectName, await thumbnailFile.arrayBuffer());
        thumbnailUrl = `/api/storage/${thumbObjectName}`;
      }

      const validatedData = insertGameSchema.parse({
        ...req.body,
        gameUrl,
        thumbnailUrl
      });
      
      const newGame = await storage.createGame(validatedData);
      
      // Handle game tags if provided
      if (req.body.categoryIds && Array.isArray(req.body.categoryIds)) {
        const tagPromises = req.body.categoryIds.map((categoryId: number) => {
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

app.patch("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { username, email, avatarUrl, bio } = req.body;
    
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
