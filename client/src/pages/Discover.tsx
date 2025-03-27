import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GameWithDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayModal from "@/components/GamePlayModal";

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

  // Sample game data for demonstration
  const sampleGames = [
    {
      id: 1, 
      title: "Bloxd.io", 
      thumbnailUrl: "https://images.crazygames.com/games/bloxd-io/cover-1600236603408.png"
    },
    {
      id: 2, 
      title: "1v1.lol", 
      thumbnailUrl: "https://cdn-cf.crazygames.com/1v1lol.png"
    },
    {
      id: 3, 
      title: "Sprunki", 
      thumbnailUrl: "https://i.ytimg.com/vi/zOBzIOz55OQ/maxresdefault.jpg"
    },
    {
      id: 4, 
      title: "Arena", 
      thumbnailUrl: "https://img.gamedistribution.com/2b60db08e5d541e3a70efd31bb13d61e-512x384.jpeg"
    }
  ];

  return (
    <div 
      className="min-h-screen" 
      style={{
        background: `linear-gradient(rgba(22, 8, 47, 0.9), rgba(22, 8, 47, 0.97)), 
                  url('https://cdn.replit.com/_next/static/media/replit-home.a4e6a113.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 py-10">
        {/* Page title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-2" style={{ fontFamily: 'Sofia Pro, sans-serif' }}>
            EXPLORE
          </h1>
        </div>

        {/* Game sections */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Recommended:</h2>
          
          {isLoading ? (
            <div className="flex flex-wrap gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="w-64 rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-36" />
                  <div className="p-2 bg-[#16082F]">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : games.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {games.slice(0, 4).map((game) => (
                <div 
                  key={game.id} 
                  className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleOpenGameDetail(game)}
                >
                  <div className="relative">
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xl font-bold">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {sampleGames.map((game) => (
                <div 
                  key={game.id} 
                  className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="relative">
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xl font-bold">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Featured:</h2>
          
          {isLoading ? (
            <div className="flex flex-wrap gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="w-64 rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-36" />
                  <div className="p-2 bg-[#16082F]">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : games.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {games.slice(0, 4).map((game) => (
                <div 
                  key={game.id} 
                  className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleOpenGameDetail(game)}
                >
                  <div className="relative">
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xl font-bold">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {sampleGames.map((game) => (
                <div 
                  key={game.id} 
                  className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="relative">
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xl font-bold">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Fortnite Gamemodes:</h2>
          
          {isLoading ? (
            <div className="flex flex-wrap gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="w-64 rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-36" />
                  <div className="p-2 bg-[#16082F]">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : games.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {games.filter(game => game.platform.name === "Fortnite").slice(0, 4).map((game) => (
                <div 
                  key={game.id} 
                  className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleOpenGameDetail(game)}
                >
                  <div className="relative">
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xl font-bold">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {sampleGames.slice(0, 2).map((game) => (
                <div 
                  key={game.id} 
                  className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="relative">
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white text-xl font-bold">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
