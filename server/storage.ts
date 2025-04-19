import { 
  users, type User, type InsertUser, 
  platforms, type Platform, type InsertPlatform,
  categories, type Category, type InsertCategory,
  games, type Game, type InsertGame, type GameWithDetails,
  gameTags, type GameTag, type InsertGameTag
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

// Define storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Platforms
  getPlatforms(): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  getPlatformByName(name: string): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: number, platformData: Partial<Platform>): Promise<Platform | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Games
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getGameByTitle(title: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, gameData: Partial<Game>): Promise<Game | undefined>;
  getFeaturedGames(): Promise<Game[]>;
  getRecommendedGames(): Promise<Game[]>;
  getGamesByPlatform(platformId: number): Promise<Game[]>;
  getGameDetails(gameId: number): Promise<GameWithDetails | undefined>;
  incrementGamePlays(gameId: number): Promise<void>;

  // Game Tags
  getGameTags(gameId: number): Promise<GameTag[]>;
  addGameTag(gameTag: InsertGameTag): Promise<GameTag>;

  // Search
  searchGames(query: string): Promise<Game[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private platforms: Map<number, Platform>;
  private categories: Map<number, Category>;
  private games: Map<number, Game>;
  private gameTags: Map<number, GameTag>;

  private userId: number;
  private platformId: number;
  private categoryId: number;
  private gameId: number;
  private gameTagId: number;

  constructor() {
    this.users = new Map();
    this.platforms = new Map();
    this.categories = new Map();
    this.games = new Map();
    this.gameTags = new Map();

    this.userId = 1;
    this.platformId = 1;
    this.categoryId = 1;
    this.gameId = 1;
    this.gameTagId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // Initialize with default data
  private async initializeData() {
    // Create platforms
    const htmlPlatform: InsertPlatform = { 
      name: "HTML", 
      icon: "fab fa-html5", 
      description: "Create browser games using HTML, CSS, and JavaScript.",
      color: "#FF5722"
    };
    const robloxPlatform: InsertPlatform = { 
      name: "Roblox", 
      icon: "fas fa-play", 
      description: "Share your Roblox experiences and games with the community.",
      color: "#6C2FF2"
    };
    const fortnitePlatform: InsertPlatform = { 
      name: "Fortnite", 
      icon: "/assets/fortnite-logo.png", 
      description: "Share your Fortnite Creative maps and game modes.",
      color: "#4CAF50"
    };
    const recroomPlatform: InsertPlatform = { 
      name: "RecRoom", 
      icon: "fas fa-vr-cardboard", 
      description: "Share your RecRoom creations and VR experiences.",
      color: "#9C27B0"
    };

    await this.createPlatform(htmlPlatform);
    await this.createPlatform(robloxPlatform);
    await this.createPlatform(fortnitePlatform);
    await this.createPlatform(recroomPlatform);

    // Create categories
    const categories = [
      { name: "Adventure", icon: "fas fa-mountain" },
      { name: "Action", icon: "fas fa-bolt" },
      { name: "Puzzle", icon: "fas fa-puzzle-piece" },
      { name: "Strategy", icon: "fas fa-chess" },
      { name: "RPG", icon: "fas fa-hat-wizard" },
      { name: "Simulation", icon: "fas fa-city" },
      { name: "Sports", icon: "fas fa-football-ball" },
      { name: "Racing", icon: "fas fa-car" },
      { name: "Shooter", icon: "fas fa-crosshairs" },
      { name: "Horror", icon: "fas fa-ghost" }
    ];

    for (const category of categories) {
      await this.createCategory(category as InsertCategory);
    }

    // Create default admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "password",
      email: "admin@gamesf7.com",
      avatarUrl: "https://ui-avatars.com/api/?name=Admin&background=007AF4&color=fff"
    };

    await this.createUser(adminUser);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      avatarUrl: insertUser.avatarUrl || null,
      bio: null
    };
    this.users.set(id, user);
    return user;
  }

  // Platforms
  async getPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async getPlatformByName(name: string): Promise<Platform | undefined> {
    return Array.from(this.platforms.values()).find(platform => 
      platform.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.platformId++;
    const platform: Platform = { ...insertPlatform, id };
    this.platforms.set(id, platform);
    return platform;
  }

  async updatePlatform(id: number, platformData: Partial<Platform>): Promise<Platform | undefined> {
    const platform = await this.getPlatform(id);
    if (!platform) return undefined;

    const updatedPlatform = { ...platform, ...platformData };
    this.platforms.set(id, updatedPlatform);
    return updatedPlatform;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Games
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGameByTitle(title: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(game => 
      game.title.toLowerCase() === title.toLowerCase()
    );
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameId++;
    const now = new Date();
    const game: Game = { 
      ...insertGame, 
      id, 
      isFeatured: false, 
      plays: 0, 
      rating: 0, 
      createdAt: now,
      htmlContent: insertGame.htmlContent || null,
      gameUrl: insertGame.gameUrl || null
    };
    this.games.set(id, game);
    return game;
  }

  async getFeaturedGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isFeatured);
  }

  async getRecommendedGames(): Promise<Game[]> {
    // Return games with highest play counts (top 5)
    return Array.from(this.games.values())
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getGamesByPlatform(platformId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.platformId === platformId);
  }

  async updateGame(id: number, gameData: Partial<Game>): Promise<Game | undefined> {
    const game = await this.getGame(id);
    if (!game) return undefined;

    const updatedGame = { ...game, ...gameData };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async getGameDetails(gameId: number): Promise<GameWithDetails | undefined> {
    const game = await this.getGame(gameId);
    if (!game) return undefined;

    const platform = await this.getPlatform(game.platformId);
    if (!platform) return undefined;

    const creator = await this.getUser(game.creatorId);
    if (!creator) return undefined;

    const gameTags = Array.from(this.gameTags.values()).filter(tag => tag.gameId === gameId);
    const categoryPromises = gameTags.map(tag => this.getCategory(tag.categoryId));
    const categoryResults = await Promise.all(categoryPromises);
    const categories = categoryResults.filter((cat): cat is Category => cat !== undefined);

    return {
      ...game,
      platform,
      creator,
      categories
    };
  }

  async incrementGamePlays(gameId: number): Promise<void> {
    const game = await this.getGame(gameId);
    if (game) {
      game.plays += 1;
      this.games.set(gameId, game);
    }
  }

  // Game Tags
  async getGameTags(gameId: number): Promise<GameTag[]> {
    return Array.from(this.gameTags.values()).filter(tag => tag.gameId === gameId);
  }

  async addGameTag(insertGameTag: InsertGameTag): Promise<GameTag> {
    const id = this.gameTagId++;
    const gameTag: GameTag = { ...insertGameTag, id };
    this.gameTags.set(id, gameTag);
    return gameTag;
  }

  // Search
  async searchGames(query: string): Promise<Game[]> {
    const lowercaseQuery = query.toLowerCase();
    const allGames = Array.from(this.games.values());

    return allGames.filter(game => 
      game.title.toLowerCase().includes(lowercaseQuery) || 
      game.description.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    // Using a more efficient query with limit 1 since we only need one result
    const results = await db.select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return results.length ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Using a more efficient query with limit 1
    try {
      // Get all users and filter case-insensitively (needed because eq() is case-sensitive)
      const allUsers = await db.select().from(users);
      const matchingUser = allUsers.find(user => 
        user.username.toLowerCase() === username.toLowerCase()
      );

      return matchingUser;
    } catch (error) {
      console.error("Error getting user by username:", error);
      // Retry once on failure
      const allUsers = await db.select().from(users);
      const matchingUser = allUsers.find(user => 
        user.username.toLowerCase() === username.toLowerCase()
      );

      return matchingUser;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userWithDefaults = {
      ...insertUser,
      avatarUrl: insertUser.avatarUrl || null,
      bio: null
    };
    const [user] = await db.insert(users).values(userWithDefaults).returning();
    return user;
  }

  // Platforms
  async getPlatforms(): Promise<Platform[]> {
    return db.select().from(platforms);
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    const results = await db.select().from(platforms).where(eq(platforms.id, id));
    return results.length ? results[0] : undefined;
  }

  async getPlatformByName(name: string): Promise<Platform | undefined> {
    // Get all platforms and filter case-insensitively
    const allPlatforms = await db.select().from(platforms);
    const matchingPlatform = allPlatforms.find(platform => 
      platform.name.toLowerCase() === name.toLowerCase()
    );

    return matchingPlatform;
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const [platform] = await db.insert(platforms).values(insertPlatform).returning();
    return platform;
  }

  async updatePlatform(id: number, platformData: Partial<Platform>): Promise<Platform | undefined> {
    const platform = await this.getPlatform(id);
    if (!platform) return undefined;

    const [updatedPlatform] = await db
      .update(platforms)
      .set(platformData)
      .where(eq(platforms.id, id))
      .returning();

    return updatedPlatform;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const results = await db.select().from(categories).where(eq(categories.id, id));
    return results.length ? results[0] : undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Games
  async getGames(): Promise<Game[]> {
    return db.select().from(games);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const results = await db.select().from(games).where(eq(games.id, id));
    return results.length ? results[0] : undefined;
  }

  async getGameByTitle(title: string): Promise<Game | undefined> {
    // Get all games and filter case-insensitively
    const allGames = await db.select().from(games);
    const matchingGame = allGames.find(game => 
      game.title.toLowerCase() === title.toLowerCase()
    );

    return matchingGame;
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const gameWithDefaults = {
      ...insertGame,
      isFeatured: false,
      plays: 0,
      rating: 0,
      htmlContent: insertGame.htmlContent || null,
      gameUrl: insertGame.gameUrl || null
    };
    const [game] = await db.insert(games).values(gameWithDefaults).returning();
    return game;
  }

  async getFeaturedGames(): Promise<Game[]> {
    return db.select().from(games).where(eq(games.isFeatured, true));
  }

  async getRecommendedGames(): Promise<Game[]> {
    // Return games with highest play counts (top 5)
    return db.select().from(games).orderBy(sql`${games.plays} DESC`).limit(5);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  async getGamesByPlatform(platformId: number): Promise<Game[]> {
    return db.select().from(games).where(eq(games.platformId, platformId));
  }

  async updateGame(id: number, gameData: Partial<Game>): Promise<Game | undefined> {
    const game = await this.getGame(id);
    if (!game) return undefined;

    const [updatedGame] = await db
      .update(games)
      .set(gameData)
      .where(eq(games.id, id))
      .returning();

    return updatedGame;
  }

  async getGameDetails(gameId: number): Promise<GameWithDetails | undefined> {
    const game = await this.getGame(gameId);
    if (!game) return undefined;

    const platform = await this.getPlatform(game.platformId);
    if (!platform) return undefined;

    const creator = await this.getUser(game.creatorId);
    if (!creator) return undefined;

    const gameTags = await this.getGameTags(gameId);
    const categoryPromises = gameTags.map(tag => this.getCategory(tag.categoryId));
    const categoryResults = await Promise.all(categoryPromises);
    const categories = categoryResults.filter((cat): cat is Category => cat !== undefined);

    return {
      ...game,
      platform,
      creator,
      categories
    };
  }

  async incrementGamePlays(gameId: number): Promise<void> {
    const game = await this.getGame(gameId);
    if (game) {
      await db
        .update(games)
        .set({ plays: game.plays + 1 })
        .where(eq(games.id, gameId));
    }
  }

  // Game Tags
  async getGameTags(gameId: number): Promise<GameTag[]> {
    return db.select().from(gameTags).where(eq(gameTags.gameId, gameId));
  }

  async addGameTag(insertGameTag: InsertGameTag): Promise<GameTag> {
    const [gameTag] = await db.insert(gameTags).values(insertGameTag).returning();
    return gameTag;
  }

  // Search
  async searchGames(query: string): Promise<Game[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;

    return db.select()
      .from(games)
      .where(
        sql`LOWER(${games.title}) LIKE ${lowercaseQuery} OR LOWER(${games.description}) LIKE ${lowercaseQuery}`
      );
  }
}

// Use DatabaseStorage for persistence
export const storage = new DatabaseStorage();