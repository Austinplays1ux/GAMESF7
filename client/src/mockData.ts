// Mock data for the application when database is not available
import { Game, GameWithDetails, Platform, User, Category } from "../../index";

// Common platforms
export const mockPlatforms: Platform[] = [
  {
    id: 1,
    name: "HTML Games",
    icon: "fab fa-html5",
    description: "Games built with HTML and JavaScript that run directly in your browser.",
    color: "#E34F26",
  },
  {
    id: 2,
    name: "Roblox",
    icon: "fa-brands fa-roblox",
    description: "Discover popular Roblox games and experiences created by the community.",
    color: "#00A2FF",
    supportsVR: false,
  },
  {
    id: 3,
    name: "Fortnite",
    icon: "fas fa-gamepad",
    description: "Amazing Fortnite Creative maps and game modes.",
    color: "#9D4DFF",
    supportsVR: false,
  },
  {
    id: 4,
    name: "RecRoom",
    icon: "fas fa-vr-cardboard",
    description: "Virtual worlds and games in RecRoom. Many support VR headsets.",
    color: "#FF4D6A",
    supportsVR: true,
  },
];

// Categories for games
export const mockCategories: Category[] = [
  { id: 1, name: "Action", icon: "fas fa-bolt" },
  { id: 2, name: "Adventure", icon: "fas fa-hiking" },
  { id: 3, name: "Puzzle", icon: "fas fa-puzzle-piece" },
  { id: 4, name: "Racing", icon: "fas fa-car" },
  { id: 5, name: "Shooter", icon: "fas fa-crosshairs" },
  { id: 6, name: "Multiplayer", icon: "fas fa-users" },
  { id: 7, name: "Virtual Reality", icon: "fas fa-vr-cardboard" },
  { id: 8, name: "Casual", icon: "fas fa-coffee" },
];

// Common users
export const mockUsers: User[] = [
  {
    id: 1,
    username: "testuser",
    email: "testuser@example.com",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    username: "admin",
    email: "admin@gamesf7.com",
    createdAt: new Date("2023-12-01"),
  },
  {
    id: 3,
    username: "crystalgamer77",
    email: "crystalgamer77@gmail.com",
    createdAt: new Date("2023-11-15"),
  },
];

// Basic game data
export const mockGames: Game[] = [
  {
    id: 1,
    title: "Bloxd.io",
    description: "A fast-paced block building game where you compete against other players to build the best structures.",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShT4ysT9elNLh_SVLehunOEyW31ELOHhmLXg&s",
    platformId: 2,
    creatorId: 3,
    gameUrl: "https://bloxd.io",
    isFeatured: true,
    plays: 15234,
    rating: 4.7,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: 2,
    title: "1v1.lol",
    description: "Build, break and eliminate! A battle royale where you need to build to survive.",
    thumbnailUrl: "https://cdn-cf.crazygames.com/1v1lol.png",
    platformId: 3,
    creatorId: 3,
    gameUrl: "https://1v1.lol",
    isFeatured: true,
    plays: 24512,
    rating: 4.8,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    title: "Sprunki",
    description: "Explore a vibrant world filled with challenges and adventures. Collect coins and power-ups.",
    thumbnailUrl: "https://i.ytimg.com/vi/zOBzIOz55OQ/maxresdefault.jpg",
    platformId: 4,
    creatorId: 1,
    gameUrl: "https://recroom.com/room/sprunki",
    isFeatured: false,
    plays: 9876,
    rating: 4.5,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: 4,
    title: "Arena Showdown",
    description: "Enter the arena and battle against opponents in this action-packed PvP game.",
    thumbnailUrl: "https://img.gamedistribution.com/2b60db08e5d541e3a70efd31bb13d61e-512x384.jpeg",
    platformId: 1,
    creatorId: 2,
    gameUrl: "/games/arena-showdown",
    htmlContent: "<div>Interactive Arena Game</div>",
    isFeatured: true,
    plays: 12043,
    rating: 4.6,
    createdAt: new Date("2024-02-28"),
  },
  {
    id: 5,
    title: "Zombie Survival",
    description: "Survive the zombie apocalypse as long as you can. Collect weapons and defeat endless waves of zombies.",
    thumbnailUrl: "https://assets-prd.ignimgs.com/2021/12/14/zombiesurvival-1639463131367.jpg",
    platformId: 3,
    creatorId: 3,
    gameUrl: "https://fortnite.com/zombiesurvival",
    isFeatured: false,
    plays: 18721,
    rating: 4.3,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: 6,
    title: "Space Explorer",
    description: "Explore the vast reaches of space in this immersive VR adventure game. Discover new planets and alien life.",
    thumbnailUrl: "https://media.wired.co.uk/photos/606da9d5dc4121389838bb50/master/w_1600,c_limit/interstellar.jpg",
    platformId: 4,
    creatorId: 2,
    gameUrl: "https://recroom.com/room/spaceexplorer",
    isFeatured: false,
    plays: 7654,
    rating: 4.9,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: 7,
    title: "Pirate Adventures",
    description: "Set sail on the high seas in this adventure game. Find hidden treasure and battle enemy ships.",
    thumbnailUrl: "https://static.wixstatic.com/media/a2d8b5_a15a2d0e8c5c4bd2bb33d8dea9c0bae8~mv2.jpg",
    platformId: 2,
    creatorId: 1,
    gameUrl: "https://roblox.com/games/pirateadventures",
    isFeatured: true,
    plays: 14532,
    rating: 4.4,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: 8,
    title: "Puzzle Quest",
    description: "Test your brain with challenging puzzles. Solve riddles and unlock new levels in this brain teaser game.",
    thumbnailUrl: "https://www.mobygames.com/images/covers/l/127473-puzzle-quest-challenge-of-the-warlords-nintendo-ds-front-cover.jpg",
    platformId: 1,
    creatorId: 3,
    gameUrl: "/games/puzzle-quest",
    htmlContent: "<div>Interactive Puzzle Game</div>",
    isFeatured: false,
    plays: 8765,
    rating: 4.2,
    createdAt: new Date("2024-03-05"),
  },
];

// Generate full game details
export const mockGameDetails: GameWithDetails[] = mockGames.map(game => {
  const platform = mockPlatforms.find(p => p.id === game.platformId) as Platform;
  const creator = mockUsers.find(u => u.id === game.creatorId) as User;
  
  // Assign 2-3 random categories to each game
  const gameCategories: Category[] = [];
  const numberOfCategories = 2 + Math.floor(Math.random() * 2); // 2 or 3 categories
  
  // Get random category indices without duplicates
  const categoryIndices = new Set<number>();
  while (categoryIndices.size < numberOfCategories) {
    const randomIndex = Math.floor(Math.random() * mockCategories.length);
    categoryIndices.add(randomIndex);
  }
  
  // Add the categories
  categoryIndices.forEach(index => {
    gameCategories.push(mockCategories[index]);
  });
  
  return {
    ...game,
    platform,
    creator,
    categories: gameCategories,
  };
});

// Featured and recommended games
export const mockFeaturedGames: GameWithDetails[] = 
  mockGameDetails.filter(game => game.isFeatured);

export const mockRecommendedGames: GameWithDetails[] = 
  mockGameDetails.filter(game => game.rating >= 4.5).slice(0, 4);

// Platform-specific games
export const mockRobloxGames: GameWithDetails[] = 
  mockGameDetails.filter(game => game.platformId === 2);

export const mockFortniteGames: GameWithDetails[] = 
  mockGameDetails.filter(game => game.platformId === 3);

export const mockRecroomGames: GameWithDetails[] = 
  mockGameDetails.filter(game => game.platformId === 4);