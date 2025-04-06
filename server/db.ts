import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure NeonDB settings
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = false;
neonConfig.pipelineTLS = false;
neonConfig.pipelineConnect = false;

// Add connection caching
neonConfig.fetchConnectionCache = true; // Enable connection caching

// Note: Some newer Neon config options might not be recognized by TypeScript yet

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create database connection pool with optimized settings
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  max: 20,                     // Maximum number of clients the pool should contain
  idleTimeoutMillis: 30000,    // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
  query_timeout: 5000,         // How long a query is allowed to run before timing out
  maxUses: 100                 // Recycle connections after 100 uses to prevent memory issues
});

// Handle unexpected pool errors to prevent app crashes
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
  // Don't crash the app, just log the error
});

// Helper function to execute queries with retry logic
export async function executeWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 300): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    console.log(`Database operation failed, retrying... (${retries} attempts left)`);
    
    // Wait for a short delay before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the operation with exponential backoff
    return executeWithRetry(fn, retries - 1, delay * 1.5);
  }
}

// Connect DB with schema
export const db = drizzle({ client: pool, schema });
