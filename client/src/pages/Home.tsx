import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import CategoryTabs from "@/components/CategoryTabs";
import GameGrid from "@/components/GameGrid";
import CallToAction from "@/components/CallToAction";
import PlatformSection from "@/components/PlatformSection";
import CreateGameModal from "@/components/CreateGameModal";
import { Game, Platform, User, GameWithDetails } from "@/types";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayModal from "@/components/GamePlayModal";

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);

  // This would be handled by query parameters in a real app
  const endpoint = activeCategory === "all" 
    ? "/api/games" 
    : activeCategory === "featured" 
      ? "/api/games/featured" 
      : `/api/games?platformId=${activeCategory}`;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
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
    <main className="container mx-auto px-4 py-6">
      <HeroSection />

      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <GameGrid
        title={activeCategory === "featured" ? "Featured Games" : 
              activeCategory === "all" ? "All Games" : 
              "Platform Games"}
        endpoint={endpoint}
        viewAllLink="/discover"
      />

      <CallToAction />

      <PlatformSection />

      {/* Modals */}
      <CreateGameModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
      
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
    </main>
  );
};

export default Home;
