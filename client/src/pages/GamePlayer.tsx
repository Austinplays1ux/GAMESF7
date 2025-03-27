import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GameWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const GamePlayer: React.FC = () => {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/play/:id");
  const gameId = params?.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: game, isError } = useQuery<GameWithDetails>({
    queryKey: [`/api/games/${gameId}`],
    enabled: !!gameId,
  });

  useEffect(() => {
    if (game) {
      // Record game play
      apiRequest("POST", `/api/games/${game.id}/play`, {})
        .catch(error => console.error("Failed to record play:", error));
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [game]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would communicate with the iframe
  };
  
  const handleRefreshGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
    }
  };
  
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleBack = () => {
    navigate(`/games/${gameId}`);
  };

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

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-64px)]">
      <div 
        ref={containerRef}
        className="bg-[#121212] rounded-lg overflow-hidden flex flex-col h-full"
      >
        <div className="flex justify-between items-center p-4 border-b border-[#2A2A2A]">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-4"
              onClick={handleBack}
            >
              <i className="fas fa-arrow-left mr-2"></i> Back
            </Button>
            <h1 className="text-lg font-semibold">{game.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 rounded hover:bg-[#2A2A2A]" 
              onClick={handleToggleFullscreen}
            >
              <i className={`fas fa-${isFullscreen ? 'compress-alt' : 'expand-alt'}`}></i>
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-black flex items-center justify-center">
          {isLoading ? (
            <div className="text-center p-8">
              <div className="w-32 h-32 mx-auto mb-4 animate-spin rounded-full border-t-4 border-[#007AF4] border-opacity-50"></div>
              <p className="text-lg">Loading game...</p>
              <p className="text-sm text-gray-400 mt-2">Please wait while the game loads</p>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={game.gameUrl}
              title={game.title}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              allow="autoplay; fullscreen"
              loading="lazy"
            ></iframe>
          )}
        </div>
        
        <div className="p-4 border-t border-[#2A2A2A] flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded hover:bg-[#2A2A2A]" 
              onClick={handleToggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              <i className={`fas fa-volume-${isMuted ? 'mute' : 'up'}`}></i>
            </button>
            <button 
              className="p-2 rounded hover:bg-[#2A2A2A]" 
              onClick={handleRefreshGame}
              title="Reload game"
            >
              <i className="fas fa-redo"></i>
            </button>
          </div>
          <div>
            <span className="text-gray-400 text-sm">
              Having issues?{" "}
              <a href="#" className="text-[#007AF4] hover:underline">
                Report a problem
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
