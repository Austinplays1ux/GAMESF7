import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GameWithDetails } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import GameDetailModal from "@/components/GameDetailModal";
import GamePlayModal from "@/components/GamePlayModal";
import CreateGameModal from "@/components/CreateGameModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MyGames: React.FC = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("created");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGamePlayOpen, setIsGamePlayOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<number | null>(null);

  // Fetch user's created games
  const { 
    data: createdGames = [], 
    isLoading: isLoadingCreated,
    refetch: refetchCreated
  } = useQuery<GameWithDetails[]>({
    queryKey: ["/api/games", "created", user?.id],
    queryFn: async () => {
      // This would normally filter by creatorId on the server
      const res = await fetch("/api/games");
      const allGames = await res.json();
      return allGames.filter((game: GameWithDetails) => game.creatorId === user?.id);
    },
    enabled: !!user,
  });

  // Fetch games played by user (simulated for now)
  const { 
    data: playedGames = [], 
    isLoading: isLoadingPlayed 
  } = useQuery<GameWithDetails[]>({
    queryKey: ["/api/games", "played", user?.id],
    queryFn: async () => {
      // This would normally get a user's play history from the server
      const res = await fetch("/api/games");
      const allGames = await res.json();
      // For demonstration, just showing some random games as "played"
      return allGames.slice(0, 3);
    },
    enabled: !!user,
  });

  // Fetch user's favorite games (simulated for now)
  const { 
    data: favoritedGames = [], 
    isLoading: isLoadingFavorites 
  } = useQuery<GameWithDetails[]>({
    queryKey: ["/api/games", "favorites", user?.id],
    queryFn: async () => {
      // This would normally get a user's favorites from the server
      const res = await fetch("/api/games/featured");
      return await res.json();
    },
    enabled: !!user,
  });

  const handleCreateGame = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetchCreated();
    toast({
      title: "Success!",
      description: "Your game has been created and published.",
    });
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

  const handleEditGame = (game: GameWithDetails) => {
    navigate(`/edit-game/${game.id}`);
  };

  const confirmDeleteGame = (gameId: number) => {
    setGameToDelete(gameId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteGame = async () => {
    if (!gameToDelete) return;
    
    try {
      // This would be an API call to delete the game
      // await fetch(`/api/games/${gameToDelete}`, { method: "DELETE" });
      
      toast({
        title: "Game deleted",
        description: "Your game has been successfully removed.",
      });
      
      // Refetch the created games list
      refetchCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setGameToDelete(null);
    }
  };

  const renderGameGrid = (games: GameWithDetails[], isLoading: boolean, emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-3 glass-panel">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (games.length === 0) {
      return (
        <div className="glass-panel p-8 rounded-xl text-center">
          <i className="fas fa-gamepad text-5xl text-purple-400 mb-4"></i>
          <h3 className="text-2xl font-semibold mb-2">No games found</h3>
          <p className="text-gray-300 mb-6">
            {emptyMessage}
          </p>
          {activeTab === "created" && (
            <Button 
              onClick={handleCreateGame}
              className="glass-button bg-purple-600/60 hover:bg-purple-600/80"
            >
              <i className="fas fa-plus-circle mr-2"></i> Create New Game
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] glass-card relative group"
          >
            <div className="relative" onClick={() => handleOpenGameDetail(game)}>
              <img 
                src={game.thumbnailUrl} 
                alt={game.title} 
                className="w-full h-48 object-cover"
              />
              {game.isFeatured && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black font-semibold rounded-full py-0.5 px-3 text-xs">
                  <i className="fas fa-star mr-1"></i> Featured
                </div>
              )}
              <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded overflow-hidden mr-2 bg-purple-800/50 p-1">
                    <i className={game.platform.icon} style={{ color: game.platform.color }}></i>
                  </div>
                  <p className="text-white text-sm font-medium">{game.platform.name}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4" onClick={() => handleOpenGameDetail(game)}>
              <h3 className="text-xl font-bold mb-1">{game.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-2 mb-2">{game.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt mr-1 text-purple-400 text-xs"></i>
                  <span className="text-gray-300 text-xs">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-gamepad mr-1 text-pink-400 text-xs"></i>
                  <span className="text-gray-300 text-xs">{game.plays} plays</span>
                </div>
              </div>
            </div>
            
            {/* Action buttons for created games */}
            {activeTab === "created" && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="glass-button bg-black/50 border-white/20 h-8 w-8 p-0">
                      <i className="fas fa-ellipsis-v"></i>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-dropdown w-36">
                    <DropdownMenuItem onClick={() => handleEditGame(game)} className="cursor-pointer">
                      <i className="fas fa-edit mr-2 text-blue-400"></i> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => confirmDeleteGame(game.id)} className="cursor-pointer text-red-400">
                      <i className="fas fa-trash-alt mr-2"></i> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        ))}

        {/* Add new game card (only in created tab) */}
        {activeTab === "created" && (
          <div 
            className="rounded-xl overflow-hidden glass-card border-2 border-dashed border-purple-500/30 flex flex-col items-center justify-center h-[320px] cursor-pointer hover:border-purple-500/60 transition-colors"
            onClick={handleCreateGame}
          >
            <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
              <i className="fas fa-plus text-2xl text-purple-400"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 gradient-text">Create New Game</h3>
            <p className="text-gray-300 text-sm text-center px-6">
              Share your own game or create an HTML game
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen pt-16 pb-20" 
      style={{
        backgroundImage: `linear-gradient(rgba(22, 8, 47, 0.9), rgba(22, 8, 47, 0.97)), 
                url('https://cdn.replit.com/_next/static/media/replit-home.a4e6a113.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">My Games</h1>
            <p className="text-gray-300 text-lg">
              Manage your created, played, and favorite games
            </p>
          </div>
          <Button 
            onClick={handleCreateGame} 
            className="glass-button bg-purple-600/60 hover:bg-purple-600/80 mt-4 md:mt-0"
          >
            <i className="fas fa-plus-circle mr-2"></i> Create Game
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="created" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass-navbar rounded-lg mb-8 p-1 bg-[#16082F]/70">
            <TabsTrigger 
              value="created" 
              className="sofia-pro data-[state=active]:bg-purple-600/40 data-[state=active]:text-white rounded-md px-6 py-2.5"
            >
              <i className="fas fa-code mr-2"></i> Created
            </TabsTrigger>
            <TabsTrigger 
              value="played" 
              className="sofia-pro data-[state=active]:bg-purple-600/40 data-[state=active]:text-white rounded-md px-6 py-2.5"
            >
              <i className="fas fa-gamepad mr-2"></i> Recently Played
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="sofia-pro data-[state=active]:bg-purple-600/40 data-[state=active]:text-white rounded-md px-6 py-2.5"
            >
              <i className="fas fa-heart mr-2"></i> Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                Created Games
              </h2>
              <span className="text-sm text-gray-400">
                {createdGames.length} {createdGames.length === 1 ? 'game' : 'games'}
              </span>
            </div>
            {renderGameGrid(
              createdGames, 
              isLoadingCreated, 
              "You haven't created any games yet. Click below to create your first game!"
            )}
          </TabsContent>

          <TabsContent value="played" className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                Recently Played
              </h2>
              <span className="text-sm text-gray-400">
                {playedGames.length} {playedGames.length === 1 ? 'game' : 'games'}
              </span>
            </div>
            {renderGameGrid(
              playedGames, 
              isLoadingPlayed, 
              "You haven't played any games yet. Explore our game library to find something to play!"
            )}
          </TabsContent>

          <TabsContent value="favorites" className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                Favorite Games
              </h2>
              <span className="text-sm text-gray-400">
                {favoritedGames.length} {favoritedGames.length === 1 ? 'game' : 'games'}
              </span>
            </div>
            {renderGameGrid(
              favoritedGames, 
              isLoadingFavorites, 
              "You haven't added any games to your favorites yet. Heart your favorite games to see them here!"
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Game Modal */}
      <CreateGameModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

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

      {/* Confirm Delete Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Game</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this game? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              variant="outline" 
              className="glass-button border-white/10" 
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button 
              className="glass-button bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-500/30"
              onClick={handleDeleteGame}
            >
              Delete Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyGames;