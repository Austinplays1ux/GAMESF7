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
    <div className="h-[100vh] flex flex-col">
      {/* Glassmorphic Navigation Bar */}
      <div className="glass-navbar fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#16082F]/70 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4 text-white/90 hover:text-white hover:bg-white/10"
              onClick={handleBack}
            >
              <i className="fas fa-arrow-left mr-2"></i> Exit Game
            </Button>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{game.title}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-white/10 transition-all" 
              onClick={handleToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Game Container */}
      <div className="container mx-auto px-4 pt-16 pb-6 flex-1">
        <div 
          ref={containerRef}
          className="glass-card rounded-lg overflow-hidden flex flex-col h-full"
        >
          <div className="flex justify-between items-center p-4 border-b border-purple-500/20">
            <div className="flex items-center">
              <h1 className="text-lg font-medium text-white/90">Now Playing</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/60">Game by {game.creator.username}</span>
            </div>
          </div>
          
          <div className="flex-1 bg-black flex items-center justify-center">
            {isLoading ? (
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-4 animate-spin rounded-full border-t-4 border-purple-500 border-opacity-50"></div>
                <p className="text-lg">Loading game...</p>
                <p className="text-sm text-white/60 mt-2">Please wait while the game loads</p>
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
          
          <div className="p-4 border-t border-purple-500/20 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 rounded-full hover:bg-white/10 transition-all" 
                onClick={handleToggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                <i className={`fas fa-volume-${isMuted ? 'mute' : 'up'}`}></i>
              </button>
              <button 
                className="p-2 rounded-full hover:bg-white/10 transition-all" 
                onClick={handleRefreshGame}
                title="Reload game"
              >
                <i className="fas fa-redo"></i>
              </button>
            </div>
            <div>
              <span className="text-white/60 text-sm">
                Having issues?{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline">
                  Report a problem
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
