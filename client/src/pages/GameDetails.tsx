import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GameWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GamePlayModal from "@/components/GamePlayModal";
import { apiRequest } from "@/lib/queryClient";

const GameDetails: React.FC = () => {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/games/:id");
  const gameId = params?.id;
  
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);

  const { data: game, isLoading, isError } = useQuery<GameWithDetails>({
    queryKey: [`/api/games/${gameId}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch game details: ${response.status}`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No game data received');
        }
        return data;
      } catch (error) {
        console.error('Error fetching game:', error);
        throw error;
      }
    },
    enabled: !!gameId,
    retry: 1,
    retryDelay: 1000
  });

  if (isError) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Game</h2>
          <p className="text-gray-400 mb-4">Unable to load game details. Please try again later.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handlePlayGame = async () => {
    if (game) {
      // Record game play
      try {
        await apiRequest("POST", `/api/games/${game.id}/play`, {});
      } catch (error) {
        console.error("Failed to record play:", error);
      }
      
      // Open game play modal
      setIsGamePlayOpen(true);
    }
  };

  const handleCloseGamePlay = () => {
    setIsGamePlayOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-full h-80 rounded-xl mb-6" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-3/4 mb-8" />
          <div className="flex space-x-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
        <p className="text-gray-400 mb-6">
          We couldn't find the game you're looking for.
        </p>
        <Button 
          onClick={() => navigate('/discover')}
          className="bg-[#007AF4]"
        >
          Browse Games
        </Button>
      </div>
    );
  }

  const formattedPlayCount = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(game.plays);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-6">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-80 object-cover rounded-xl"
          />
          <div 
            className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: game.platform.color }}
          >
            {game.platform.name}
          </div>
        </div>

        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold font-montserrat">{game.title}</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <i className="fas fa-user mr-1 text-gray-400"></i>
              <span className="text-gray-300">{formattedPlayCount} plays</span>
            </div>
            <div className="flex items-center text-yellow-400">
              <i className="fas fa-star mr-1"></i>
              <span>{game.rating / 10}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-8">
          <img
            src={game.creator.avatarUrl || `https://ui-avatars.com/api/?name=${game.creator.username}&background=007AF4&color=fff`}
            alt={game.creator.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-gray-300">Created by</p>
            <p className="font-medium">{game.creator.username}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">About This Game</h2>
          <p className="text-gray-300 mb-4">{game.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {game.categories.map((category) => (
              <span key={category.id} className="bg-[#2A2A2A] px-3 py-1 rounded-full text-sm">
                {category.name}
              </span>
            ))}
          </div>
        </div>

        {game.platform.name === "HTML" && (
          <div className="bg-[#1E1E1E] rounded-lg p-5 mb-8">
            <h2 className="text-xl font-semibold mb-3">Game Features</h2>
            <ul className="list-disc list-inside text-gray-300 pl-4 space-y-1">
              <li>Play directly in your browser</li>
              <li>No downloads required</li>
              <li>Instant gameplay</li>
              <li>Works on all modern browsers</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            className="bg-[#FF5722] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-lg flex-1 transition"
            onClick={handlePlayGame}
          >
            <i className="fas fa-play mr-2"></i>Play Game
          </Button>
          <Button
            variant="outline"
            className="bg-[#121212] border border-white hover:bg-[#2A2A2A] text-white font-medium py-3 px-8 rounded-lg transition"
          >
            <i className="fas fa-plus mr-2"></i>Add to Collection
          </Button>
          <Button
            variant="outline"
            className="bg-[#121212] border border-white hover:bg-[#2A2A2A] text-white font-medium p-3 rounded-lg transition"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: game.title,
                  text: game.description,
                  url: window.location.href,
                });
              }
            }}
          >
            <i className="fas fa-share-alt"></i>
          </Button>
        </div>
      </div>

      {/* Game Play Modal */}
      <GamePlayModal
        game={game}
        isOpen={isGamePlayOpen}
        onClose={handleCloseGamePlay}
      />
    </div>
  );
};

export default GameDetails;
