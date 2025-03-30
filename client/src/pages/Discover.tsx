import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GameWithDetails, Platform } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayModal from "@/components/GamePlayModal";
import { Button } from "@/components/ui/button";

const Discover: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const platformParam = searchParams.get("platform");

  const [activeCategory, setActiveCategory] = useState(platformParam || "all");
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);

  useEffect(() => {
    // Update active category when URL changes
    const platformValue = searchParams.get("platform");
    if (platformValue) {
      setActiveCategory(platformValue);
    }
  }, [location]);

  // Get platforms for filter tabs
  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const endpoint = activeCategory === "all" 
    ? "/api/games" 
    : activeCategory === "featured" 
      ? "/api/games/featured" 
      : `/api/games?platformId=${activeCategory}`;

  const { data: games = [], isLoading } = useQuery<GameWithDetails[]>({
    queryKey: [endpoint],
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    // Update URL to reflect current filter
    const params = new URLSearchParams();
    if (category !== "all" && category !== "featured") {
      params.set("platform", category);
    }

    const newUrl = `/discover${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  const handleOpenGameDetail = (game: GameWithDetails) => {
    setSelectedGame(game);
    setIsGameDetailOpen(true);
  };

  const handleCloseGameDetail = () => {
    setIsGameDetailOpen(false);
  };

  const handlePlayGame = () => {
    setIsGameDetailOpen(false);
    setIsGamePlayOpen(true);
  };

  const handleCloseGamePlay = () => {
    setIsGamePlayOpen(false);
  };

  // Filter games by platform if needed
  const filteredGames = activeCategory === "all" 
    ? games 
    : activeCategory === "featured" 
      ? games.filter(game => game.isFeatured) 
      : games.filter(game => game.platformId.toString() === activeCategory);

  // Get unique platform IDs from games for creating sections, filtering out games without platforms
  const uniquePlatforms = Array.from(new Set(
    games
      .filter(game => game.platform && typeof game.platform === 'object')
      .map(game => game.platform.id)
  ));

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#16082F] to-[#1F0F3C]" 
      style={{
        backgroundImage: `linear-gradient(rgba(22, 8, 47, 0.9), rgba(22, 8, 47, 0.97)), 
                  url('https://cdn.replit.com/_next/static/media/replit-home.a4e6a113.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 py-10">
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-2 gradient-text" style={{ fontFamily: 'Sofia Pro, sans-serif' }}>
            EXPLORE GAMES
          </h1>
          <p className="text-xl text-purple-300/80 max-w-3xl mx-auto">
            Discover amazing games from HTML5, Roblox, Fortnite, and RecRoom platforms
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center mb-10 gap-3">
          <Button
            onClick={() => handleCategoryChange("all")}
            className={`glass-button px-6 py-2.5 rounded-full ${
              activeCategory === "all" ? "bg-purple-600/40 border-purple-500" : "border-white/10"
            }`}
          >
            All Games
          </Button>

          <Button
            onClick={() => handleCategoryChange("featured")}
            className={`glass-button px-6 py-2.5 rounded-full ${
              activeCategory === "featured" ? "bg-purple-600/40 border-purple-500" : "border-white/10"
            }`}
          >
            <i className="fas fa-star mr-2 text-yellow-400"></i> Featured
          </Button>

          {platforms.map((platform) => (
            <Button
              key={platform.id}
              onClick={() => handleCategoryChange(platform.id.toString())}
              className={`glass-button px-6 py-2.5 rounded-full ${
                activeCategory === platform.id.toString() ? "bg-purple-600/40 border-purple-500" : "border-white/10"
              }`}
            >
              <i className={`${platform.icon} mr-2`} style={{ color: platform.color }}></i>
              {platform.name}
            </Button>
          ))}
        </div>

        {/* Game sections */}
        {isLoading ? (
          <div className="glass-panel p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Games</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-3 glass-panel">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="glass-panel p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-6 gradient-text">
              {activeCategory === "all" ? "All Games" : 
               activeCategory === "featured" ? "Featured Games" : 
               platforms.find(p => p.id.toString() === activeCategory)?.name || "Games"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <div 
                  key={game.id} 
                  className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] glass-card"
                  onClick={() => handleOpenGameDetail(game)}
                >
                  <div className="relative">
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-48 object-cover"
                    />
                    {game.isFeatured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black font-semibold rounded-full py-0.5 px-3 text-xs">
                        <i className="fas fa-star mr-1"></i> Featured
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded overflow-hidden mr-2 bg-purple-800/50 p-1">
                          <i className={game.platform.icon} style={{ color: game.platform.color }}></i>
                        </div>
                        <p className="text-white text-sm font-medium">{game.platform.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-2">{game.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-user mr-1 text-purple-400 text-xs"></i>
                        <span className="text-gray-300 text-xs">{game.creator.username}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-gamepad mr-1 text-pink-400 text-xs"></i>
                        <span className="text-gray-300 text-xs">{game.plays} plays</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-xl text-center">
            <i className="fas fa-search-minus text-5xl text-purple-400 mb-4"></i>
            <h3 className="text-2xl font-semibold mb-2">No games found</h3>
            <p className="text-gray-300 mb-6">
              We couldn't find any games matching your current filters.
            </p>
            <Button 
              onClick={() => handleCategoryChange("all")}
              className="glass-button bg-purple-600/60 hover:bg-purple-600/80"
            >
              View all games
            </Button>
          </div>
        )}

        {/* Platform sections (only on "all" view) */}
        {activeCategory === "all" && uniquePlatforms.map(platformId => {
          const platform = platforms.find(p => p.id === platformId);
          const platformGames = games.filter(game => game.platform && game.platform.id === platformId);

          if (!platform || platformGames.length === 0) return null;

          return (
            <div key={platformId} className="glass-panel p-6 rounded-xl mb-8">
              <div className="flex items-center mb-6">
                <i className={`${platform.icon} mr-3 text-2xl`} style={{ color: platform.color }}></i>
                <h2 className="text-2xl font-bold gradient-text">{platform.name} Games</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {platformGames.slice(0, 4).map((game) => (
                  <div 
                    key={game.id} 
                    className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] glass-card"
                    onClick={() => handleOpenGameDetail(game)}
                  >
                    <div className="relative">
                      <img 
                        src={game.thumbnailUrl} 
                        alt={game.title} 
                        className="w-full h-48 object-cover"
                      />
                      {game.isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black font-semibold rounded-full py-0.5 px-3 text-xs">
                          <i className="fas fa-star mr-1"></i> Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-2">{game.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <i className="fas fa-user mr-1 text-purple-400 text-xs"></i>
                          <span className="text-gray-300 text-xs">{game.creator.username}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-gamepad mr-1 text-pink-400 text-xs"></i>
                          <span className="text-gray-300 text-xs">{game.plays} plays</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {platformGames.length > 4 && (
                <div className="text-center mt-6">
                  <Button 
                    onClick={() => handleCategoryChange(platformId.toString())}
                    className="glass-button bg-transparent hover:bg-purple-600/20"
                  >
                    View all {platform.name} games <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Game Modals */}
      {selectedGame && (
        <>
          <GameDetailModal
            game={selectedGame}
            isOpen={isGameDetailOpen}
            onClose={handleCloseGameDetail}
            onPlay={handlePlayGame}
          />

          <GamePlayModal
            game={selectedGame}
            isOpen={isGamePlayOpen}
            onClose={handleCloseGamePlay}
          />
        </>
      )}
    </div>
  );
};

export default Discover;