import { db } from "./db";
import { storage } from "./storage";
import { eq } from "drizzle-orm";

async function quickSeed() {
  console.log("Running quick seed...");

  try {
    // Create admin user
    const admin = await storage.createUser({
      username: "admin",
      password: "password",
      email: "admin@gamesf7.com",
      avatarUrl: "https://ui-avatars.com/api/?name=Admin&background=8833FF&color=fff",
      bio: "Site administrator"
    });

    console.log("Created admin user:", admin);

    // Create one platform
    const htmlPlatform = await storage.createPlatform({ 
      name: "HTML", 
      icon: "/images/platforms/html-icon.webp", 
      description: "Play browser-based HTML5 games directly in your browser.",
      color: "#E44D26",
    });

    console.log("Created HTML platform:", htmlPlatform);

    // Create one category
    const adventureCategory = await storage.createCategory({
      name: "Adventure",
      icon: "fas fa-mountain"
    });

    console.log("Created Adventure category:", adventureCategory);

    // Create one game
    const game = await storage.createGame({
      title: "Sample HTML Game",
      description: "A simple HTML game to test the platform.",
      thumbnailUrl: "/images/games/sample-game.png",
      platformId: htmlPlatform.id,
      creatorId: admin.id,
      gameUrl: "",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Simple Game</title>
          <style>
            body { margin: 0; overflow: hidden; }
            canvas { display: block; }
            #game-container {
              width: 100%;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #222;
            }
            .game-message {
              color: white;
              font-family: Arial, sans-serif;
              font-size: 24px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div id="game-container">
            <div class="game-message">
              <h1>Sample HTML Game</h1>
              <p>This is a placeholder for an HTML game.</p>
              <p>Click anywhere to "play"</p>
            </div>
          </div>
          <script>
            document.getElementById('game-container').addEventListener('click', function() {
              alert('Game clicked! This would start the game in a real implementation.');
            });
          </script>
        </body>
        </html>
      `
    });

    console.log("Created sample game:", game);

    // Add a game tag
    const gameTag = await storage.addGameTag({
      gameId: game.id,
      categoryId: adventureCategory.id
    });

    console.log("Added game tag:", gameTag);

    // Set the game as featured
    await db.execute(`UPDATE games SET is_featured = true WHERE id = ${game.id}`);
    console.log("Set game as featured");

    console.log("Quick seed completed successfully!");
    return true;
  } catch (error) {
    console.error("Error during quick seed:", error);
    return false;
  }
}

// Run the quick seed function and exit
quickSeed()
  .then((success) => {
    console.log(`Quick seed ${success ? 'completed successfully' : 'failed'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error("Unhandled error during quick seed:", error);
    process.exit(1);
  });