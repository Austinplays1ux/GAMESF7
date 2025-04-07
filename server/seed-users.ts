import { storage } from "./storage";

async function seedUsers() {
  console.log("Running user seed script...");

  try {
    // Create users
    const users = [
      {
        username: "admin",
        password: "admin123",
        email: "admin@gamesf7.com",
        avatarUrl: "https://ui-avatars.com/api/?name=Admin&background=007AF4&color=fff",
        bio: "Site administrator"
      },
      {
        username: "testuser",
        password: "password",
        email: "test@example.com",
        avatarUrl: "https://ui-avatars.com/api/?name=Test+User&background=FF5733&color=fff",
        bio: "Just a test user"
      },
      {
        username: "crystalgamer77",
        password: "Al998340",
        email: "crystalgamer77@example.com",
        avatarUrl: "https://ui-avatars.com/api/?name=Crystal+Gamer&background=8833FF&color=fff",
        bio: "Site owner and developer"
      }
    ];
    
    for (const userData of users) {
      try {
        const existingUser = await storage.getUserByUsername(userData.username);
        if (!existingUser) {
          console.log(`Creating user: ${userData.username}`);
          const user = await storage.createUser(userData);
          console.log(`User created successfully: ${user.username} (ID: ${user.id})`);
        } else {
          console.log(`User ${userData.username} already exists with ID: ${existingUser.id}`);
        }
      } catch (err) {
        console.error(`Error creating user ${userData.username}:`, err);
      }
    }

    console.log("User seed completed successfully!");
  } catch (error) {
    console.error("Error during user seeding:", error);
  }
}

// Run the seed users function
seedUsers()
  .catch(console.error)
  .finally(() => console.log("User seeding process complete"));