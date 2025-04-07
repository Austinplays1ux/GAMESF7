import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Platform, GameWithDetails } from "../../../index";
import PlatformEditModal from "./PlatformEditModal";
import GameEditModal from "./GameEditModal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Search } from "lucide-react";
import { mockPlatforms, mockGameDetails } from "@/mockData";

export default function AdminPanel() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [isPlatformEditModalOpen, setIsPlatformEditModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameWithDetails | null>(null);
  const [isGameEditModalOpen, setIsGameEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformsData, setPlatformsData] = useState<Platform[]>([]);
  const [gamesData, setGamesData] = useState<GameWithDetails[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Make sure the user is admin
  if (!user?.isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Load mock data directly - this ensures we always have data even if API fails
  useEffect(() => {
    // Short timeout to simulate loading
    setTimeout(() => {
      setPlatformsData(mockPlatforms);
      setGamesData(mockGameDetails);
      setIsLoadingPlatforms(false);
      setIsLoadingGames(false);
    }, 500);
  }, []);

  // Also try to fetch data from the API (will use TanStack's smart defaults)
  const { data: apiPlatforms } = useQuery<Platform[]>({
    queryKey: ['/api/platforms'],
  });

  const { data: apiGames } = useQuery<GameWithDetails[]>({
    queryKey: ['/api/games'],
  });

  // If API returns data, use it instead of mock data
  useEffect(() => {
    if (apiPlatforms && apiPlatforms.length > 0) {
      setPlatformsData(apiPlatforms);
    }
  }, [apiPlatforms]);

  useEffect(() => {
    if (apiGames && apiGames.length > 0) {
      setGamesData(apiGames);
    }
  }, [apiGames]);

  const handleEditPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsPlatformEditModalOpen(true);
  };

  const handleEditGame = (game: GameWithDetails) => {
    setSelectedGame(game);
    setIsGameEditModalOpen(true);
  };

  // Filter games based on search query
  const filteredGames = searchQuery 
    ? gamesData.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.creator.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : gamesData;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            Manage your platforms, games, categories, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="platforms">
            <TabsList className="mb-4">
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="games">Games</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="platforms">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoadingPlatforms ? (
                  Array(4).fill(0).map((_, i) => (
                    <Card key={i} className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800" />
                  ))
                ) : (
                  platforms.map((platform: Platform) => (
                    <Card key={platform.id} className="relative overflow-hidden border border-blue-100 dark:border-blue-900">
                      <div 
                        className="absolute top-0 left-0 w-full h-1" 
                        style={{ backgroundColor: platform.color }} 
                      />
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {platform.icon.startsWith('fa') ? (
                              <i className={`${platform.icon} text-xl`} style={{ color: platform.color }}></i>
                            ) : (
                              <img 
                                src={platform.icon} 
                                alt={platform.name} 
                                className="w-8 h-8 object-contain" 
                              />
                            )}
                            <CardTitle className="text-lg">{platform.name}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPlatform(platform)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {platform.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="games">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search games by title, platform or creator..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="px-4 py-2 text-left">Thumbnail</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Platform</th>
                      <th className="px-4 py-2 text-left">Creator</th>
                      <th className="px-4 py-2 text-left">Plays</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingGames ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b dark:border-gray-700">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="h-10 animate-pulse bg-gray-100 dark:bg-gray-800 rounded" />
                          </td>
                        </tr>
                      ))
                    ) : filteredGames.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                          No games found matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredGames.map((game) => (
                        <tr key={game.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-2">
                            <div className="w-16 h-9 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                              <img
                                src={game.thumbnailUrl}
                                alt={game.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://placehold.co/160x90?text=No+Image";
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 font-medium">{game.title}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-1.5">
                              {game.platform.icon.startsWith('fa') ? (
                                <i className={`${game.platform.icon} text-sm`} style={{ color: game.platform.color }}></i>
                              ) : (
                                <img
                                  src={game.platform.icon}
                                  alt={game.platform.name}
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                              <span>{game.platform.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">{game.creator.username}</td>
                          <td className="px-4 py-2">{game.plays}</td>
                          <td className="px-4 py-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditGame(game)}
                              className="flex items-center gap-1 h-8"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="categories">
              <p>Category management coming soon.</p>
            </TabsContent>
            
            <TabsContent value="users">
              <p>User management coming soon.</p>
            </TabsContent>
            
            <TabsContent value="reports">
              <p>Reports coming soon.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isPlatformEditModalOpen && (
        <PlatformEditModal 
          platform={selectedPlatform} 
          isOpen={isPlatformEditModalOpen} 
          onClose={() => setIsPlatformEditModalOpen(false)} 
        />
      )}
      
      {isGameEditModalOpen && (
        <GameEditModal
          game={selectedGame}
          isOpen={isGameEditModalOpen}
          onClose={() => setIsGameEditModalOpen(false)}
        />
      )}
    </div>
  );
}