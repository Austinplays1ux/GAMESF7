import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";
import ws from 'ws';

// Configure WebSocket for Neon DB
neonConfig.webSocketConstructor = ws;
// Disable secure WebSocket in development
neonConfig.useSecureWebSocket = false;

// Log the database configuration
console.log('Configuring database connection...');

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a standard connection pool
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

// Basic error handling
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// Connect DB with schema
export const db = drizzle({ client: pool, schema });
