import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { GameWithDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayModal from "@/components/GamePlayModal";

const Home: React.FC = () => {
  const [, navigate] = useLocation();
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);

  // Query for featured games
  const { data: featuredGames = [], isLoading: isLoadingFeatured } = useQuery<GameWithDetails[]>({
    queryKey: ["/api/games/featured"],
  });

  // Query for all games
  const { data: allGames = [], isLoading: isLoadingAll } = useQuery<GameWithDetails[]>({
    queryKey: ["/api/games"],
  });

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
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Sofia Pro, sans-serif' }}>
            Welcome to GAMESF7
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover and play awesome games created by the community
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 rounded-full px-8 py-6"
              onClick={() => navigate("/discover")}
            >
              <i className="fas fa-compass mr-2"></i> Explore Games
            </Button>
            <Button 
              className="bg-pink-600 hover:bg-pink-700 rounded-full px-8 py-6"
              onClick={() => navigate("/create")}
            >
              <i className="fas fa-plus mr-2"></i> Create Game
            </Button>
          </div>
        </div>

        {/* Featured Games */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Games</h2>
            <Button 
              variant="link" 
              className="text-purple-400 hover:text-purple-300"
              onClick={() => navigate("/discover")}
            >
              View All <i className="fas fa-chevron-right ml-1"></i>
            </Button>
          </div>

          {isLoadingFeatured ? (
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
          ) : featuredGames.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {featuredGames.slice(0, 4).map((game) => (
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

        {/* Recent Games */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Games</h2>
            <Button 
              variant="link" 
              className="text-purple-400 hover:text-purple-300"
              onClick={() => navigate("/discover")}
            >
              View All <i className="fas fa-chevron-right ml-1"></i>
            </Button>
          </div>

          {isLoadingAll ? (
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
          ) : allGames.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {allGames.slice(0, 4).map((game) => (
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
              {sampleGames.slice(0, 4).reverse().map((game) => (
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

        {/* Platform Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4 text-3xl">
              <i className="fab fa-html5"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">HTML Games</h3>
            <p className="text-gray-200 mb-4">Play games directly in your browser without any downloads.</p>
            <Button variant="outline" className="border-white text-white hover:bg-purple-700">
              Explore HTML Games
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4">
              <img src="/images/platforms/roblox-icon.webp" alt="Roblox" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold mb-2">Roblox Games</h3>
            <p className="text-gray-200 mb-4">Discover the best Roblox games created by the community.</p>
            <Button variant="outline" className="border-white text-white hover:bg-blue-700">
              Explore Roblox Games
            </Button>
          </div>

          <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4 text-3xl">
              <i className="fas fa-basketball-ball"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">RecRoom Games</h3>
            <p className="text-gray-200 mb-4">The best RecRoom game modes and experiences.</p>
            <Button variant="outline" className="border-white text-white hover:bg-green-700">
              Explore RecRoom Games
            </Button>
          </div>

          <div className="bg-gradient-to-r from-pink-900 to-pink-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4 text-3xl">
              <i className="fas fa-cubes"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Fortnite Creative</h3>
            <p className="text-gray-200 mb-4">Amazing Fortnite Creative maps and game modes.</p>
            <Button variant="outline" className="border-white text-white hover:bg-pink-700">
              Explore Fortnite Games
            </Button>
          </div>
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

export default Home;