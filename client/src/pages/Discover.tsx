import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { GameDetailModal } from '@/components/GameDetailModal';
import { GamePlayModal } from '@/components/GamePlayModal';
import type { Platform, GameWithDetails } from '@/types';

const Discover: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const platformParam = searchParams.get("platform");

  const [activeCategory, setActiveCategory] = useState(platformParam || "all");
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);

  // Get platforms for filter tabs
  const { data: platforms = [], isLoading: platformsLoading } = useQuery<Platform[]>({
    queryKey: ['platforms'],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Get games based on active category
  const { data: games = [], isLoading: gamesLoading } = useQuery<GameWithDetails[]>({
    queryKey: ['games', activeCategory],
    queryFn: async () => {
      const endpoint = activeCategory === "all" 
        ? "/api/games" 
        : activeCategory === "featured" 
          ? "/api/games/featured" 
          : `/api/games?platformId=${activeCategory}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams();
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

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="glass-card rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
              onClick={() => handleGameSelect(game)}
            >
              <div className="aspect-video relative">
                <img
                  src={game.thumbnail}
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