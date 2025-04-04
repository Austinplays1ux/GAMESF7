import { db } from "./db";
import { 
  users, 
  platforms, 
  categories,
  games,
  gameTags
} from "@shared/schema";
import { storage } from "./storage";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data to avoid duplicates
  await db.delete(gameTags);
  await db.delete(games);
  await db.delete(categories);
  await db.delete(platforms);
  await db.delete(users);

  console.log("Database cleared");

  // Create admin user
  const admin = await storage.createUser({
    username: "admin",
    password: "password",
    email: "admin@gamesf7.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Admin&background=8833FF&color=fff"
  });

  console.log("Created admin user");

  // Create platforms
  const html = await storage.createPlatform({ 
    name: "HTML", 
    icon: "fab fa-html5", 
    description: "Play browser-based HTML5 games directly in your browser.",
    color: "#E44D26",
  });

  const roblox = await storage.createPlatform({ 
    name: "Roblox", 
    icon: "fas fa-cube", 
    description: "Discover the best Roblox experiences created by the community.",
    color: "#00A2FF",
  });

  const fortnite = await storage.createPlatform({ 
    name: "Fortnite", 
    icon: "fas fa-gamepad", 
    description: "Find and share amazing Fortnite Creative maps and game modes.",
    color: "#9D4DFF",
  });

  const recroom = await storage.createPlatform({ 
    name: "RecRoom", 
    icon: "fas fa-vr-cardboard", 
    description: "Explore the best RecRoom games and experiences.",
    color: "#FF4D4D",
  });

  console.log("Created platforms");

  // Create categories
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

  const categoryPromises = categoryData.map(cat => 
    storage.createCategory(cat)
  );

  const createdCategories = await Promise.all(categoryPromises);
  console.log("Created categories");

  // Create sample games
  const game1 = await storage.createGame({
    title: "Pixel Runner",
    description: "A fast-paced HTML5 platformer where you control a pixel character running through various obstacles.",
    thumbnailUrl: "https://placehold.co/400x225/8833FF/FFFFFF?text=Pixel+Runner",
    platformId: html.id,
    creatorId: admin.id,
    gameUrl: "https://example.com/pixelrunner",
    htmlContent: `<div style="text-align: center; padding: 50px;">
      <h1>Pixel Runner</h1>
      <p>Game would load here in production version</p>
    </div>`
  });

  const game2 = await storage.createGame({
    title: "Bloxd.io",
    description: "Build anything you can imagine in this multiplayer block building game.",
    thumbnailUrl: "https://images.crazygames.com/games/bloxd-io/cover-1600236603408.png",
    platformId: html.id,
    creatorId: admin.id,
    htmlContent: `<iframe src="https://bloxd.io" style="width:100%; height:100%; border:none;" allow="fullscreen" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"></iframe>`
  });

  const game3 = await storage.createGame({
    title: "Battle Royale Pro",
    description: "A custom Fortnite map featuring unique gameplay mechanics and challenging environments.",
    thumbnailUrl: "https://placehold.co/400x225/9D4DFF/FFFFFF?text=Battle+Royale+Pro",
    platformId: fortnite.id,
    creatorId: admin.id,
    gameUrl: "https://www.epicgames.com/fortnite/island-codes/battle-royale-pro"
  });

  const game4 = await storage.createGame({
    title: "VR Hangout",
    description: "Join friends in a virtual space where you can play mini-games and socialize in VR.",
    thumbnailUrl: "https://placehold.co/400x225/FF4D4D/FFFFFF?text=VR+Hangout",
    platformId: recroom.id,
    creatorId: admin.id,
    gameUrl: "https://rec.net/room/VRHangout"
  });

  console.log("Created sample games");

  // Add game categories
  await storage.addGameTag({ gameId: game1.id, categoryId: createdCategories[1].id }); // Action
  await storage.addGameTag({ gameId: game1.id, categoryId: createdCategories[7].id }); // Racing

  await storage.addGameTag({ gameId: game2.id, categoryId: createdCategories[0].id }); // Adventure
  await storage.addGameTag({ gameId: game2.id, categoryId: createdCategories[5].id }); // Simulation

  await storage.addGameTag({ gameId: game3.id, categoryId: createdCategories[1].id }); // Action
  await storage.addGameTag({ gameId: game3.id, categoryId: createdCategories[8].id }); // Shooter

  await storage.addGameTag({ gameId: game4.id, categoryId: createdCategories[0].id }); // Adventure
  await storage.addGameTag({ gameId: game4.id, categoryId: createdCategories[5].id }); // Simulation

  console.log("Added game categories");

  // Update featured and recommended games
  await db.execute(
    `UPDATE games SET is_featured = true WHERE id = ${game1.id}`
  );

  // Set more plays for Bloxd.io to make it appear in recommended
  await db.execute(
    `UPDATE games SET plays = 100 WHERE id = ${game2.id}`
  );

  console.log("Set featured game");

  console.log("Database seeded successfully!");
}

// Run the seed function
seed()
  .catch(error => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seed script completed");
    process.exit(0);
  });