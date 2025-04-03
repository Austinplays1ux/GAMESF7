import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import GameDetailModal from '@/components/GameDetailModal';
import GamePlayModal from '@/components/GamePlayModal';
import type { Platform, GameWithDetails } from '@/types';

const Discover: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const platformParam = searchParams.get("platform");
  const searchQuery = searchParams.get("search");

  const [activeCategory, setActiveCategory] = useState(platformParam || "all");
  const [searchTerm, setSearchTerm] = useState(searchQuery || "");
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);

  // Get platforms for filter tabs
  const { data: platforms = [], isLoading: platformsLoading } = useQuery<Platform[]>({
    queryKey: ['platforms'],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Get games based on active category and search term
  const { data: games = [], isLoading: gamesLoading } = useQuery<GameWithDetails[]>({
    queryKey: ['games', activeCategory, searchTerm],
    queryFn: async () => {
      // Start building the endpoint
      let endpoint = "/api/games";
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Handle category filtering
      if (activeCategory === "featured") {
        endpoint = "/api/games/featured";
      } else if (activeCategory !== "all") {
        params.set("platformId", activeCategory);
      }
      
      // Handle search term
      if (searchTerm) {
        params.set("search", searchTerm);
      }
      
      // Combine endpoint with params
      const finalEndpoint = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`;
      
      const response = await fetch(finalEndpoint);
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams();
    
    // Preserve search term if exists
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    
    // Add platform parameter if not 'all' or 'featured'
    if (category !== "all" && category !== "featured") {
      params.set("platform", category);
    }
    
    const newUrl = `/discover${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  const handleGameSelect = (game: GameWithDetails) => {
    setSelectedGame(game);
    setIsGameDetailOpen(true);
  };

  const handlePlayGame = () => {
    setIsGameDetailOpen(false);
    setIsGamePlayOpen(true);
  };

  if (platformsLoading || gamesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 bg-gradient-to-b from-[#16082F] to-[#060210]">
      <div className="container mx-auto px-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            onClick={() => handleCategoryChange("all")}
            className={`glass-button px-6 py-2.5 rounded-full ${
              activeCategory === "all" ? "bg-purple-600/30" : "bg-transparent"
            }`}
          >
            All Games
          </Button>

          <Button
            onClick={() => handleCategoryChange("featured")}
            className={`glass-button px-6 py-2.5 rounded-full ${
              activeCategory === "featured" ? "bg-purple-600/30" : "bg-transparent"
            }`}
          >
            <i className="fas fa-star mr-2 text-yellow-400"></i> Featured
          </Button>

          {platforms.map((platform) => (
            <Button
              key={platform.id}
              onClick={() => handleCategoryChange(platform.id.toString())}
              className={`glass-button px-6 py-2.5 rounded-full ${
                activeCategory === platform.id.toString() ? "bg-purple-600/30" : "bg-transparent"
              }`}
            >
              <i className={`${platform.icon} mr-2`} style={{ color: platform.color }}></i>
              {platform.name}
            </Button>
          ))}
        </div>

        {/* Search results heading */}
        {searchTerm && (
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Search results for "{searchTerm}"
              </h2>
              <p className="text-gray-400">
                Found {games.length} {games.length === 1 ? 'game' : 'games'}
              </p>
            </div>
            <Button 
              variant="outline"
              className="glass-button border-white/10 text-white"
              onClick={() => {
                setSearchTerm("");
                // Preserve only category filter in URL
                const params = new URLSearchParams();
                if (activeCategory !== "all" && activeCategory !== "featured") {
                  params.set("platform", activeCategory);
                }
                const newUrl = `/discover${params.toString() ? `?${params.toString()}` : ""}`;
                window.history.pushState({}, "", newUrl);
              }}
            >
              <i className="fas fa-times mr-2"></i> Clear search
            </Button>
          </div>
        )}
        
        {/* Games grid */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="glass-card rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
                onClick={() => handleGameSelect(game)}
              >
                <div className="aspect-video relative">
                  <img
                    src={game.thumbnailUrl}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {game.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
                  {game.platform && (
                    <div className="mt-2 flex items-center">
                      <i
                        className={`${game.platform.icon} mr-2`}
                        style={{ color: game.platform.color }}
                      ></i>
                      <span className="text-sm text-gray-400">{game.platform.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 glass-card rounded-xl my-4">
            <div className="text-center">
              <i className="fas fa-search text-5xl text-gray-500 mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {searchTerm 
                  ? `We couldn't find any games matching "${searchTerm}". Try a different search term.` 
                  : "No games are available in this category yet."}
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                  // Update URL
                  window.history.pushState({}, "", "/discover");
                }}
                className="glass-button bg-purple-600/60 hover:bg-purple-600/80 text-white"
              >
                Browse all games
              </Button>
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedGame && (
          <>
            <GameDetailModal
              game={selectedGame}
              isOpen={isGameDetailOpen}
              onClose={() => setIsGameDetailOpen(false)}
              onPlay={handlePlayGame}
            />
            <GamePlayModal
              game={selectedGame}
              isOpen={isGamePlayOpen}
              onClose={() => setIsGamePlayOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Discover;