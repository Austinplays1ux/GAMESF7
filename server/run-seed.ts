import { db } from "./db";
import { 
  users, 
  platforms, 
  categories,
  games,
  gameTags
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data to avoid duplicates
  try {
    console.log("Clearing existing data...");
    await db.delete(gameTags);
    await db.delete(games);
    await db.delete(categories);
    await db.delete(platforms);
    await db.delete(users);
    console.log("Database cleared");
  } catch (error) {
    console.error("Error clearing database:", error);
    // Continue execution despite errors
  }

  try {
    // Create users
    console.log("Creating users...");
    // Regular test user
    const testUser = await storage.createUser({
      username: "testuser",
      password: "password",
      email: "test@example.com",
      avatarUrl: "https://ui-avatars.com/api/?name=Test+User&background=FF5733&color=fff",
      bio: "Just a test user"
    });
    
    // Admin user
    const adminUser = await storage.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@gamesf7.com",
      avatarUrl: "https://ui-avatars.com/api/?name=Admin&background=007AF4&color=fff",
      bio: "Site administrator"
    });
    
    // Owner user
    const ownerUser = await storage.createUser({
      username: "crystalgamer77",
      password: "Al998340",
      email: "crystalgamer77@example.com",
      avatarUrl: "https://ui-avatars.com/api/?name=Crystal+Gamer&background=8833FF&color=fff",
      bio: "Site owner and developer"
    });
    
    console.log("Created users:", testUser.username, adminUser.username, ownerUser.username);

    // Create platforms
    console.log("Creating platforms...");
    const html = await storage.createPlatform({
      name: "HTML",
      icon: "fab fa-html5",
      description: "Play browser-based HTML5 games directly in your browser.",
      color: "#E44D26",
    });

    const roblox = await storage.createPlatform({
      name: "Roblox",
      icon: "/images/platforms/roblox-icon.webp",
      description: "Discover the best Roblox experiences created by the community.",
      color: "#00A2FF",
    });

    const fortnite = await storage.createPlatform({
      name: "Fortnite",
      icon: "/images/platforms/fortnite-logo.png",
      description: "Find and share amazing Fortnite Creative maps and game modes.",
      color: "#9D4DFF",
    });

    const recroom = await storage.createPlatform({
      name: "RecRoom",
      icon: "/images/platforms/recroom-logo.png",
      description: "Explore the best RecRoom games and experiences.",
      color: "#FF4D4D",
    });

    console.log("Created platforms:", html.name, roblox.name, fortnite.name, recroom.name);

    // Create categories
    console.log("Creating categories...");
    const categoryData = [
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

    const createdCategories = [];
    for (const cat of categoryData) {
      const category = await storage.createCategory(cat);
      createdCategories.push(category);
    }

    console.log("Created categories:", createdCategories.map(c => c.name).join(", "));

    // Create sample games
    console.log("Creating sample games...");
    const game1 = await storage.createGame({
      title: "Pixel Runner",
      description: "A fast-paced HTML5 platformer where you control a pixel character running through various obstacles.",
      thumbnailUrl: "https://placehold.co/400x225/8833FF/FFFFFF?text=Pixel+Runner",
      platformId: html.id,
      creatorId: adminUser.id,
      gameUrl: "https://example.com/pixelrunner",
      htmlContent: `<div style="text-align: center; padding: 50px;">
        <h1>Pixel Runner</h1>
        <p>Game would load here in production version</p>
      </div>`
    });

    const game2 = await storage.createGame({
      title: "Obstacle Course",
      description: "A challenging Roblox obstacle course with 100 levels of increasing difficulty.",
      thumbnailUrl: "https://placehold.co/400x225/00A2FF/FFFFFF?text=Obstacle+Course",
      platformId: roblox.id,
      creatorId: ownerUser.id,
      gameUrl: "https://www.roblox.com/games/5123600308/100-Level-Extreme-Obby",
      htmlContent: null
    });

    const game3 = await storage.createGame({
      title: "Battle Royale Pro",
      description: "A custom Fortnite map featuring unique gameplay mechanics and challenging environments.",
      thumbnailUrl: "https://placehold.co/400x225/9D4DFF/FFFFFF?text=Battle+Royale+Pro",
      platformId: fortnite.id,
      creatorId: testUser.id,
      gameUrl: "https://www.epicgames.com/fortnite/island-codes/battle-royale-pro",
      htmlContent: null
    });

    const game4 = await storage.createGame({
      title: "VR Hangout",
      description: "Join friends in a virtual space where you can play mini-games and socialize in VR.",
      thumbnailUrl: "https://placehold.co/400x225/FF4D4D/FFFFFF?text=VR+Hangout",
      platformId: recroom.id,
      creatorId: adminUser.id,
      gameUrl: "https://rec.net/room/VRHangout",
      htmlContent: null
    });

    console.log("Created sample games:", game1.title, game2.title, game3.title, game4.title);

    // Add game categories (tags)
    console.log("Adding game categories...");
    
    // For game1 (Pixel Runner)
    await storage.addGameTag({ gameId: game1.id, categoryId: createdCategories[1].id }); // Action
    await storage.addGameTag({ gameId: game1.id, categoryId: createdCategories[7].id }); // Racing

    // For game2 (Obstacle Course)
    await storage.addGameTag({ gameId: game2.id, categoryId: createdCategories[0].id }); // Adventure
    await storage.addGameTag({ gameId: game2.id, categoryId: createdCategories[1].id }); // Action

    // For game3 (Battle Royale Pro)
    await storage.addGameTag({ gameId: game3.id, categoryId: createdCategories[1].id }); // Action
    await storage.addGameTag({ gameId: game3.id, categoryId: createdCategories[8].id }); // Shooter

    // For game4 (VR Hangout)
    await storage.addGameTag({ gameId: game4.id, categoryId: createdCategories[0].id }); // Adventure
    await storage.addGameTag({ gameId: game4.id, categoryId: createdCategories[5].id }); // Simulation

    console.log("Added game categories");

    // Set the featured game and play counts using direct SQL queries
    console.log("Setting featured and recommended games...");
    try {
      await db.execute(`UPDATE games SET is_featured = true WHERE id = ${game1.id}`);
      await db.execute(`UPDATE games SET plays = 100 WHERE id = ${game2.id}`);
      await db.execute(`UPDATE games SET plays = 75 WHERE id = ${game3.id}`);
      await db.execute(`UPDATE games SET plays = 50 WHERE id = ${game4.id}`);
    } catch (err) {
      console.error("Error updating game metadata:", err);
    }

    console.log("Set featured and play counts");
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Only export the seed function
export { seed };

// Run the seed function directly
seed()
  .catch(error => {
    console.error("Unhandled error during seeding:", error);
  })
  .finally(() => {
    // Close the connection pool after seeding to prevent hanging
    try {
      // @ts-ignore - Access the underlying pool client to end the connection
      if (db.$client) db.$client.end();
    } catch (e) {
      console.log("Note: Could not cleanly close the database connection");
    }
    console.log("Seed script completed");
  });