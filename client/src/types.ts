// Import types from the shared schema
import { User, Platform, Category, Game } from '../../index';

// Re-export types that are used in the client
export type { User, Platform, Category, Game };

// Define the GameWithDetails type in the client
export interface GameWithDetails extends Game {
  platform: Platform;
  creator: User;
  categories: Category[];
}