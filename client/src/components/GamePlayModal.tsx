import { useState, useEffect, useRef } from "react";
import { GameWithDetails } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface GamePlayModalProps {
  game: GameWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

const GamePlayModal: React.FC<GamePlayModalProps> = ({
  game,
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would communicate with the iframe
  };
  
  const handleRefreshGame = () => {
    if (game.htmlContent) {
      // For HTML content, simply restart the loading process
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    } else if (iframeRef.current) {
      // For URL-based games, reload the iframe
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
    }
  };
  
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  if (!game) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card text-white max-w-6xl h-[90vh] max-h-[90vh] flex flex-col border-0 p-0">
        <div className="flex justify-between items-center p-4 border-b border-[#2A2A2A]">
          <DialogTitle className="text-lg font-semibold">Playing: {game.title}</DialogTitle>
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 rounded hover:bg-[#2A2A2A]" 
              onClick={handleToggleFullscreen}
            >
              <i className={`fas fa-${isFullscreen ? 'compress-alt' : 'expand-alt'}`}></i>
            </button>
            <DialogClose className="p-2 rounded hover:bg-[#2A2A2A]">
              <i className="fas fa-times"></i>
            </DialogClose>
          </div>
        </div>
        
        <div className="flex-1 bg-black flex items-center justify-center">
          {isLoading ? (
            <div className="text-center p-8">
              <div className="w-32 h-32 mx-auto mb-4 animate-spin rounded-full border-t-4 border-[#007AF4] border-opacity-50"></div>
              <p className="text-lg">Loading game...</p>
            </div>
          ) : game.htmlContent ? (
            <div 
              className="w-full h-full bg-white overflow-hidden"
              dangerouslySetInnerHTML={{ __html: game.htmlContent }}
            />
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
            >
              <i className={`fas fa-volume-${isMuted ? 'mute' : 'up'}`}></i>
            </button>
            <button 
              className="p-2 rounded hover:bg-[#2A2A2A]" 
              onClick={handleRefreshGame}
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
      </DialogContent>
    </Dialog>
  );
};

export default GamePlayModal;
