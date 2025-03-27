import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CategoryTabs from "@/components/CategoryTabs";
import GameCard from "@/components/GameCard";
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-poppins mb-4">Discover Games</h1>
        <p className="text-gray-400">
          Browse and play games from various platforms. Filter by category to find your next favorite game.
        </p>
      </div>

      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-[#1E1E1E] rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-5/6 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold mb-2">No Games Found</h2>
          <p className="text-gray-400 mb-4">
            We couldn't find any games for this category.
          </p>
          <p className="text-gray-400">
            Try selecting a different category or{" "}
            <a href="/create" className="text-[#007AF4] hover:underline">
              create your own game
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div key={game.id} onClick={() => handleOpenGameDetail(game)}>
              <GameCard
                game={game}
                platform={game.platform}
                creator={game.creator}
              />
            </div>
          ))}
        </div>
      )}

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
