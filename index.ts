export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Platform {
  id: number;
  name: string;
  icon: string;
  description: string;
  color: string;
  supportsVR?: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  platformId: number;
  creatorId: number;
  gameUrl: string;
  htmlContent?: string;
  isFeatured: boolean;
  plays: number;
  rating: number;
  createdAt: Date;
}

export interface GameWithDetails extends Game {
  platform: Platform;
  creator: User;
  categories: Category[];
}
