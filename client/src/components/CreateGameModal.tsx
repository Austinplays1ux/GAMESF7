import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Platform, Category } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const createGameSchema = z.object({
  platformId: z.string().min(1, "Please select a platform"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  thumbnailFile: z.instanceof(File).optional(),
  thumbnailUrl: z.string().url("Please enter a valid URL for the thumbnail").optional(),
  gameFile: z.instanceof(File).optional(),
  gameUrl: z.string().url("Please enter a valid URL").optional(),
  htmlContent: z.string().optional(),
}).refine(data => (data.thumbnailFile || data.thumbnailUrl), {
  message: "Either thumbnail file or URL is required"
}).refine(data => (data.gameFile || data.gameUrl), {
  message: "Either game file or URL is required"
});

type CreateGameFormValues = z.infer<typeof createGameSchema>;

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("html");
  
  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const form = useForm<CreateGameFormValues>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      platformId: "",
      title: "",
      description: "",
      categoryIds: [],
      thumbnailUrl: "",
      gameUrl: "",
      htmlContent: "",
    },
  });

  const createGameMutation = useMutation({
    mutationFn: async (data: CreateGameFormValues) => {
      if (!user) {
        throw new Error("You must be logged in to create a game");
      }
      
      const response = await apiRequest("POST", "/api/games", {
        ...data,
        platformId: parseInt(data.platformId),
        categoryIds: data.categoryIds.map(id => parseInt(id)),
        creatorId: user.id, // Using authenticated user's ID
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games/featured"] });
      toast({
        title: "Success!",
        description: "Your game has been created.",
      });
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create game",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateGameFormValues) => {
    createGameMutation.mutate(data);
  };

  const handlePlatformSelect = (platformType: string) => {
    setSelectedPlatform(platformType);
    const htmlPlatform = platforms.find(p => p.name === "HTML");
    
    if (platformType === "html" && htmlPlatform) {
      form.setValue("platformId", htmlPlatform.id.toString());
    } else {
      form.setValue("platformId", "");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card text-white max-w-2xl max-h-[90vh] overflow-auto backdrop-blur-xl bg-[#16082F]/70 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-poppins mb-6">
            Create or Share Your Game
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <p className="block text-gray-300 text-sm font-medium mb-2">Game Platform</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              className={`flex flex-col items-center p-4 border-2 rounded-lg glass-button transition-colors ${
                selectedPlatform === "html" ? "border-purple-500" : "border-white/10 hover:border-purple-500/50"
              }`}
              onClick={() => handlePlatformSelect("html")}
              type="button"
            >
              <i className="fab fa-html5 text-3xl mb-2 text-purple-400"></i>
              <span className="font-medium">Create HTML Game</span>
            </button>
            <button
              className={`flex flex-col items-center p-4 border-2 rounded-lg glass-button transition-colors ${
                selectedPlatform === "share" ? "border-purple-500" : "border-white/10 hover:border-purple-500/50"
              }`}
              onClick={() => handlePlatformSelect("share")}
              type="button"
            >
              <i className="fas fa-share-alt text-3xl mb-2 text-pink-400"></i>
              <span className="font-medium">Share Existing Game</span>
            </button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Game Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter game title"
                      className="bg-[#121212] border border-[#2A2A2A] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#007AF4]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your game..."
                      className="bg-[#121212] border border-[#2A2A2A] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#007AF4]"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platformId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Platform</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#121212] border border-[#2A2A2A] rounded-lg py-2 px-4">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1E1E1E] border border-[#2A2A2A]">
                      {platforms.map((platform) => (
                        <SelectItem
                          key={platform.id}
                          value={platform.id.toString()}
                        >
                          {platform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Categories</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        type="button"
                        variant="outline"
                        className={`bg-[#121212] px-3 py-1 rounded-full text-sm ${
                          field.value.includes(category.id.toString())
                            ? "border-[#007AF4] text-[#007AF4]"
                            : "border-[#2A2A2A] text-gray-400"
                        }`}
                        onClick={() => {
                          const categoryId = category.id.toString();
                          const newValue = field.value.includes(categoryId)
                            ? field.value.filter((id) => id !== categoryId)
                            : [...field.value, categoryId];
                          field.onChange(newValue);
                        }}
                      >
                        <i className={`${category.icon} mr-1`}></i>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="thumbnailFile"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Thumbnail Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="bg-[#121212] border border-[#2A2A2A] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#007AF4]"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-400">
                      Upload your game's thumbnail image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-center text-gray-400">- OR -</div>

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        className="bg-[#121212] border border-[#2A2A2A] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#007AF4]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-400">
                      Enter the URL for your game's thumbnail image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gameUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Game URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/game"
                      className="bg-[#121212] border border-[#2A2A2A] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#007AF4]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
                    {selectedPlatform === "html"
                      ? "URL where your HTML game is hosted or upload HTML content below"
                      : "Enter the URL where your game can be played"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPlatform === "html" && (
              <FormField
                control={form.control}
                name="htmlContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">HTML Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your HTML game code here..."
                        className="bg-[#121212] border border-[#2A2A2A] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#007AF4]"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-6 flex justify-end space-x-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border border-gray-600 text-gray-300 rounded-lg hover:bg-[#2A2A2A] transition"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={createGameMutation.isPending}
                className="bg-[#FF5722] text-white rounded-lg hover:bg-opacity-90 transition"
              >
                {createGameMutation.isPending ? "Creating..." : "Create Game"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;
