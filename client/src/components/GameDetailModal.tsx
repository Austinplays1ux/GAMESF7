import { useState, useEffect } from "react";
import { GameWithDetails } from "@/types";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface GameDetailModalProps {
  game: GameWithDetails;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  isOpen,
  onClose,
  onPlay,
}) => {
  const [, navigate] = useLocation();

  const handlePlay = () => {
    onPlay();
    navigate(`/play/${game.id}`);
  };

  const handleAddToCollection = () => {
    // Would be implemented with collection functionality
    console.log("Add to collection:", game.id);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: game.description,
        url: window.location.href,
      });
    }
  };

  if (!game) return null;

  const formattedPlayCount = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(game.plays);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card text-white max-w-4xl max-h-[90vh] overflow-auto border-0 p-0">
        <div className="relative">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E1E1E] to-transparent h-24"></div>
          <div className="absolute bottom-4 left-6">
            <span 
              className="text-white px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: game.platform.color }}
            >
              {game.platform.name}
            </span>
          </div>
          <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
            <i className="fas fa-times text-xl"></i>
          </DialogClose>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <DialogTitle className="text-2xl font-bold font-montserrat">{game.title}</DialogTitle>
            <div className="flex space-x-2">
              <span className="flex items-center text-yellow-400">
                <i className="fas fa-star mr-1"></i>
                <span>{game.rating / 10}</span>
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">{formattedPlayCount} plays</span>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <img
              src={game.creator.avatarUrl || `https://ui-avatars.com/api/?name=${game.creator.username}&background=007AF4&color=fff`}
              alt="Creator"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-gray-300">
              Created by{" "}
              <a href="#" className="text-[#007AF4] hover:underline">
                {game.creator.username}
              </a>
            </span>
          </div>

          <p className="text-gray-300 mb-6">{game.description}</p>

          {game.platform.name === "HTML" && (
            <ul className="list-disc list-inside text-gray-300 mb-6 pl-4 space-y-1">
              <li>Play directly in your browser</li>
              <li>No downloads required</li>
              <li>Instant gameplay</li>
              <li>Works on all modern browsers</li>
            </ul>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {game.categories.map((category) => (
              <span key={category.id} className="bg-[#2A2A2A] px-3 py-1 rounded-full text-sm">
                {category.name}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-[#FF5722] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-lg flex-1 transition"
              onClick={handlePlay}
            >
              <i className="fas fa-play mr-2"></i>Play Game
            </Button>
            <Button
              variant="outline"
              className="bg-dark border border-white hover:bg-[#2A2A2A] text-white font-medium py-3 px-8 rounded-lg transition"
              onClick={handleAddToCollection}
            >
              <i className="fas fa-plus mr-2"></i>Add to Collection
            </Button>
            <Button
              variant="outline"
              className="bg-dark border border-white hover:bg-[#2A2A2A] text-white font-medium p-3 rounded-lg transition"
              onClick={handleShare}
            >
              <i className="fas fa-share-alt"></i>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDetailModal;
