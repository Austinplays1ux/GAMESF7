import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GameWithDetails } from "../../../index";
import GameLobby from "./GameLobby";

interface GameLobbyModalProps {
  game: GameWithDetails;
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export default function GameLobbyModal({ game, isOpen, onClose, onStartGame }: GameLobbyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">{game.title} - Multiplayer Lobby</DialogTitle>
        </div>
        <div className="p-6">
          <GameLobby 
            game={game} 
            onStartGame={() => {
              onStartGame();
              onClose();
            }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}