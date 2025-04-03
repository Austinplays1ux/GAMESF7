import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Platform } from "../../../index";
import PlatformEditModal from "./PlatformEditModal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

export default function AdminPanel() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  // Fetch platforms
  const { data: platforms = [], isLoading: isLoadingPlatforms } = useQuery<Platform[]>({
    queryKey: ['/api/platforms'],
  });

  const handleEditPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            Manage your platforms, categories, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="platforms">
            <TabsList className="mb-4">
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
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

      {isEditModalOpen && (
        <PlatformEditModal 
          platform={selectedPlatform} 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
}