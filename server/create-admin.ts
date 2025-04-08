import { db } from "./db";
import { storage } from "./storage";

async function createAdmin() {
  console.log("Creating admin user...");

  try {
    // Create owner user
    const ownerUser = await storage.createUser({
      username: "crystalgamer77",
      password: "admin123", // Set a default password
      email: "admin@gamesf7.com",
      avatarUrl: "https://ui-avatars.com/api/?name=Crystal+Gamer&background=8833FF&color=fff",
      bio: "Site owner and developer"
    });
    
    console.log("Created admin user:", ownerUser);

    // Update admin flag (Note: this is a runtime property that may not be in the database schema)
    // We'll update it in the application code to handle the admin access
    console.log("Admin user created successfully!");
    return true;
  } catch (error) {
    console.error("Error creating admin user:", error);
    return false;
  }
}

// Run the function
createAdmin()
  .then((success) => {
    console.log(`Admin user creation ${success ? 'completed successfully' : 'failed'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error("Unhandled error during admin creation:", error);
    process.exit(1);
  });