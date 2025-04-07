import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GameCard from '@/components/GameCard';
import { GameWithDetails, Platform } from '@/types';

const Discover: React.FC = () => {
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get platforms for filter tabs
  const { data: platforms = [], isLoading: platformsLoading } = useQuery<Platform[]>({
    queryKey: ['platforms'],
  });

  // Get all games
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
  });

  // Filter games based on search and category
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || 
                          activeCategory === "featured" && game.isFeatured ||
                          game.platform.id.toString() === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
        {/* Search bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xl mx-auto glass-input"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            onClick={() => setActiveCategory("all")}
            className={`glass-button ${activeCategory === "all" ? "bg-purple-600/30" : "bg-transparent"}`}
          >
            All Games
          </Button>

          <Button
            onClick={() => setActiveCategory("featured")}
            className={`glass-button ${activeCategory === "featured" ? "bg-purple-600/30" : "bg-transparent"}`}
          >
            <i className="fas fa-star mr-2 text-yellow-400"></i> Featured
          </Button>

          {platforms.map((platform) => (
            <Button
              key={platform.id}
              onClick={() => setActiveCategory(platform.id.toString())}
              className={`glass-button ${
                activeCategory === platform.id.toString() ? "bg-purple-600/30" : "bg-transparent"
              }`}
            >
              <i className={`${platform.icon} mr-2`} style={{ color: platform.color }}></i>
              {platform.name}
            </Button>
          ))}
        </div>

        {/* Games grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                platform={game.platform}
                creator={game.creator}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 glass-card rounded-xl">
            <div className="text-center">
              <i className="fas fa-search text-5xl text-gray-500 mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
              <p className="text-gray-400">
                {searchTerm 
                  ? `We couldn't find any games matching "${searchTerm}"`
                  : "No games available in this category yet"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;