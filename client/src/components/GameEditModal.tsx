import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Game, GameWithDetails } from "../../../index";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface GameEditModalProps {
  game: GameWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

// Form validation schema
const gameSchema = z.object({
  thumbnailUrl: z.string().min(1, "Thumbnail URL is required"),
});

type GameFormValues = z.infer<typeof gameSchema>;

export default function GameEditModal({ game, isOpen, onClose }: GameEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: game ? {
      thumbnailUrl: game.thumbnailUrl,
    } : {
      thumbnailUrl: "",
    }
  });

  const onSubmit = async (values: GameFormValues) => {
    if (!game) return;

    // Check if the user is an admin
    if (!user?.isAdmin) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to edit games.",
        variant: "destructive"
      });
      return;
    }

    // Start with optimistic UI updates
    setIsSubmitting(true);
    
    // Create an optimistic game update
    const optimisticGame = {
      ...game,
      thumbnailUrl: values.thumbnailUrl
    };
    
    // Immediately update UI with optimistic data
    const previousGames = queryClient.getQueryData<GameWithDetails[]>(['/api/games']) || [];
    const previousFeaturedGames = queryClient.getQueryData<GameWithDetails[]>(['/api/games/featured']) || [];
    const previousRecommendedGames = queryClient.getQueryData<GameWithDetails[]>(['/api/games/recommended']) || [];
    
    // Update all relevant query caches optimistically
    queryClient.setQueryData<GameWithDetails[]>(['/api/games'], 
      oldGames => (oldGames || []).map(g => g.id === game.id ? optimisticGame : g)
    );
    
    queryClient.setQueryData<GameWithDetails[]>(['/api/games/featured'], 
      oldGames => (oldGames || []).map(g => g.id === game.id ? optimisticGame : g)
    );
    
    queryClient.setQueryData<GameWithDetails[]>(['/api/games/recommended'], 
      oldGames => (oldGames || []).map(g => g.id === game.id ? optimisticGame : g)
    );
    
    // Show immediate success feedback
    toast({
      title: "Game updating",
      description: `${game.title} thumbnail is being updated...`,
    });
    
    // Close the modal immediately for a better UX
    onClose();
    
    // In the background, actually send the update to the server
    apiRequest<Game>(`/api/games/${game.id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
      headers: {
        'x-username': user.username // Add admin authentication via headers
      }
    }).then(() => {
      // On success, just confirm with a toast
      toast({
        title: "Game updated",
        description: `${game.title} thumbnail has been updated successfully.`,
      });
    }).catch(error => {
      console.error("Failed to update game:", error);
      
      // On error, revert the optimistic updates
      queryClient.setQueryData(['/api/games'], previousGames);
      queryClient.setQueryData(['/api/games/featured'], previousFeaturedGames);
      queryClient.setQueryData(['/api/games/recommended'], previousRecommendedGames);
      
      toast({
        title: "Error",
        description: "Failed to update game thumbnail. Please try again.",
        variant: "destructive"
      });
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const thumbnailUrl = form.watch('thumbnailUrl');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Game Thumbnail</DialogTitle>
          <DialogDescription>
            Update the game's thumbnail image. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{game?.title}</h3>
              <p className="text-sm text-gray-500">Platform: {game?.platform.name}</p>
            </div>
            
            <div className="mb-6 flex justify-center">
              {thumbnailUrl ? (
                <div className="relative w-full max-w-md aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                  <img 
                    src={thumbnailUrl} 
                    alt={game?.title || "Game thumbnail"} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full max-w-md aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4 space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}