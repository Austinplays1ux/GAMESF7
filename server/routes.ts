import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertGameTagSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API routes
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
      const validatedData = insertGameSchema.parse(req.body);
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
