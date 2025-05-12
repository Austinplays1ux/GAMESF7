import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { GameWithDetails } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayModal from "@/components/GamePlayModal";
import GameCardSection from "@/components/GameCardSection";
import { 
  mockGameDetails, 
  mockFeaturedGames, 
  mockRecommendedGames,
  mockRobloxGames,
  mockFortniteGames,
  mockRecroomGames
} from "@/mockData";

const Home: React.FC = () => {
  const [, navigate] = useLocation();
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);
  
  // Local state for games data
  const [featuredGames, setFeaturedGames] = useState<GameWithDetails[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<GameWithDetails[]>([]);
  const [allGames, setAllGames] = useState<GameWithDetails[]>([]);
  const [robloxGames, setRobloxGames] = useState<GameWithDetails[]>([]);
  const [fortniteGames, setFortniteGames] = useState<GameWithDetails[]>([]);
  const [recroomGames, setRecroomGames] = useState<GameWithDetails[]>([]);
  
  // Loading states
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isLoadingRoblox, setIsLoadingRoblox] = useState(true);
  const [isLoadingFortnite, setIsLoadingFortnite] = useState(true);
  const [isLoadingRecroom, setIsLoadingRecroom] = useState(true);
  
  // Platform IDs (based on database order)
  const HTML_PLATFORM_ID = 1;
  const ROBLOX_PLATFORM_ID = 2;
  const FORTNITE_PLATFORM_ID = 3;
  const RECROOM_PLATFORM_ID = 4;
  
  // Directly load mock data with no API calls
  useEffect(() => {
    console.log("Setting mock data directly");
    
    // Short timeout to simulate loading
    setTimeout(() => {
      setFeaturedGames(mockFeaturedGames);
      setRecommendedGames(mockRecommendedGames);
      setAllGames(mockGameDetails);
      setRobloxGames(mockRobloxGames);
      setFortniteGames(mockFortniteGames);
      setRecroomGames(mockRecroomGames);
      
      // Set all loading states to false
      setIsLoadingFeatured(false);
      setIsLoadingRecommended(false);
      setIsLoadingAll(false);
      setIsLoadingRoblox(false);
      setIsLoadingFortnite(false);
      setIsLoadingRecroom(false);
    }, 800);
  }, []);

  const handleOpenGameDetail = (game: GameWithDetails) => {
    // If it's the Bloxd.io game, navigate directly to the Bloxd.io page
    if (game.title === "Bloxd.io") {
      navigate("/games/bloxd-io");
      return;
    }
    
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
      thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShT4ysT9elNLh_SVLehunOEyW31ELOHhmLXg&s"
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
        background: `linear-gradient(rgba(22, 8, 47, 0.85), rgba(22, 8, 47, 0.95)), 
                    url('/images/IMG_1348.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Hero */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center glass-panel py-12 px-8">
            <div className="md:w-1/2 text-center md:text-left md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Sofia Pro, sans-serif' }}>
                Welcome to GAMESF7
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover and play awesome games created by the community
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 rounded-full px-8 py-6"
                  onClick={() => navigate("/explore")}
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
            <div className="mt-8 md:mt-0 md:w-1/2">
              <img 
                src="/images/IMG_1348.jpeg" 
                alt="Gaming Showcase" 
                className="w-full h-auto rounded-xl border-4 border-purple-500/30 shadow-glow transform transition-transform hover:scale-105"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Recommended Games - Now First */}
        <GameCardSection
          title="Recommended Games"
          games={recommendedGames}
          isLoading={isLoadingRecommended}
          onViewAll={() => navigate("/explore")}
          onGameClick={handleOpenGameDetail}
          emptyGames={sampleGames.slice(0, 4).reverse()}
          viewAllLink="/explore"
        />

        {/* Featured Games */}
        <GameCardSection
          title="Featured Games"
          games={featuredGames}
          isLoading={isLoadingFeatured}
          onViewAll={() => navigate("/explore")}
          onGameClick={handleOpenGameDetail}
          emptyGames={sampleGames}
          viewAllLink="/explore"
        />

        {/* Roblox Games */}
        <GameCardSection
          title="Roblox Games"
          games={robloxGames}
          isLoading={isLoadingRoblox}
          onViewAll={() => navigate("/explore?platform=roblox")}
          onGameClick={handleOpenGameDetail}
          emptyGames={sampleGames.slice(1, 3)}
          maxDisplay={4}
          viewAllLink="/explore?platform=roblox"
          titleColor="text-blue-300"
        />

        {/* Fortnite Games */}
        <GameCardSection
          title="Fortnite Games"
          games={fortniteGames}
          isLoading={isLoadingFortnite}
          onViewAll={() => navigate("/explore?platform=fortnite")}
          onGameClick={handleOpenGameDetail}
          emptyGames={sampleGames.slice(2, 4)}
          maxDisplay={4}
          viewAllLink="/explore?platform=fortnite"
          titleColor="text-green-300"
        />

        {/* RecRoom Games */}
        <GameCardSection
          title="RecRoom Games"
          games={recroomGames}
          isLoading={isLoadingRecroom}
          onViewAll={() => navigate("/explore?platform=recroom")}
          onGameClick={handleOpenGameDetail}
          emptyGames={sampleGames.slice(0, 2)}
          maxDisplay={4}
          viewAllLink="/explore?platform=recroom"
          titleColor="text-pink-300"
        />

        {/* Platform Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4 text-3xl">
              <img src="/images/platforms/Roblox_2022_icon.webp" alt="Roblox" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold mb-2">HTML Games</h3>
            <p className="text-gray-200 mb-4">Play games directly in your browser without any downloads.</p>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-purple-700"
              onClick={() => navigate(`/explore?platform=${HTML_PLATFORM_ID}`)}
            >
              Explore HTML Games
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4 text-3xl">
              <i className="fa-brands fa-roblox"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Roblox Games</h3>
            <p className="text-gray-200 mb-4">Discover the best Roblox games created by the community.</p>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-blue-700"
              onClick={() => navigate(`/explore?platform=${ROBLOX_PLATFORM_ID}`)}
            >
              Explore Roblox Games
            </Button>
          </div>

          <div className="bg-gradient-to-r from-green-900 to-green-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4 text-3xl">
              <i className="fas fa-vr-cardboard"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">RecRoom Games</h3>
            <p className="text-gray-200 mb-4">The best RecRoom game modes and experiences.</p>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-green-700"
              onClick={() => navigate(`/explore?platform=${RECROOM_PLATFORM_ID}`)}
            >
              Explore RecRoom Games
            </Button>
          </div>

          <div className="bg-gradient-to-r from-pink-900 to-pink-700 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="mb-4 text-3xl">
              <i className="fas fa-crosshairs"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Fortnite Creative</h3>
            <p className="text-gray-200 mb-4">Amazing Fortnite Creative maps and game modes.</p>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-pink-700"
              onClick={() => navigate(`/explore?platform=${FORTNITE_PLATFORM_ID}`)}
            >
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