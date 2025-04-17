import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Platform } from "../../../index";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ImageIcon, TypeIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface PlatformEditModalProps {
  platform: Platform | null;
  isOpen: boolean;
  onClose: () => void;
}

// Form validation schema
const platformSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color code (e.g. #FF5722)")
});

// Predefined icons for easy selection
const fontAwesomeIcons = [
  { name: "Game Controller", value: "fas fa-gamepad" },
  { name: "HTML5", value: "fab fa-html5" },
  { name: "Globe", value: "fas fa-globe" },
  { name: "Code", value: "fas fa-code" },
  { name: "Play", value: "fas fa-play" },
  { name: "Trophy", value: "fas fa-trophy" },
  { name: "Puzzle Piece", value: "fas fa-puzzle-piece" }
];

// Custom platform images
const platformImages = [
  { name: "Roblox", value: "/images/platforms/Roblox_2022_icon.webp" },
  { name: "RecRoom", value: "/images/platforms/recroom-logo.png" },
  { name: "Fortnite", value: "/images/platforms/fortnite-logo.png" }
];

type PlatformFormValues = z.infer<typeof platformSchema>;

export default function PlatformEditModal({ platform, isOpen, onClose }: PlatformEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconTab, setIconTab] = useState<"text" | "image">(
    platform?.icon.startsWith("fa") ? "text" : "image"
  );
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformSchema),
    defaultValues: platform ? {
      name: platform.name,
      icon: platform.icon,
      description: platform.description,
      color: platform.color
    } : {
      name: "",
      icon: "",
      description: "",
      color: "#000000"
    }
  });

  const onSubmit = async (values: PlatformFormValues) => {
    if (!platform) return;

    setIsSubmitting(true);
    try {
      // Check if the user is admin - if not, show error immediately without network request
      if (!user?.isAdmin) {
        toast({
          title: "Unauthorized",
          description: "Only admin users can edit platforms.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Saving changes...",
        description: `Updating ${values.name} platform.`,
      });

      // Prepare headers with authentication info
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (user?.username) {
        headers['x-username'] = user.username;
      }

      // Make the API request with improved error handling
      const response = await apiRequest(`/api/platforms/${platform.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });

      // Invalidate and refetch platforms data
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });
      
      // Close modal and show success message
      onClose();
      toast({
        title: "Success",
        description: "Platform updated successfully"
      });

      if (!response) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to update platform';
        throw new Error(errorMessage);
      }

      const updatedPlatform = await response.json();

      // Update the cache with the confirmed data
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });

      // Close the modal on success
      onClose();

      // Show success toast
      toast({
        title: "Platform updated",
        description: `${updatedPlatform.name} platform has been updated successfully.`,
      });
    } catch (error: any) {
      console.error("Failed to update platform:", error);

      toast({
        title: "Error saving changes",
        description: `There was a problem saving your changes: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectIcon = (iconValue: string) => {
    form.setValue('icon', iconValue);
  };

  const currentIcon = form.watch('icon');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Platform</DialogTitle>
          <DialogDescription>
            Update the platform's details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Platform name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>

                  <Tabs 
                    defaultValue={iconTab} 
                    onValueChange={(value) => setIconTab(value as "text" | "image")}
                    className="w-full"
                  >
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="text" className="flex items-center">
                        <TypeIcon className="h-4 w-4 mr-2" />
                        <span>Font Icons</span>
                      </TabsTrigger>
                      <TabsTrigger value="image" className="flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        <span>Platform Images</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="mt-0">
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {fontAwesomeIcons.map((icon) => (
                          <div 
                            key={icon.value}
                            className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 relative ${
                              currentIcon === icon.value ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''
                            }`}
                            onClick={() => selectIcon(icon.value)}
                          >
                            <i className={`${icon.value} text-xl mb-1`} style={{ color: form.getValues('color') }}></i>
                            <span className="text-xs text-center truncate w-full">{icon.name}</span>
                            {currentIcon === icon.value && (
                              <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="Custom font awesome class (e.g., fas fa-gamepad)" 
                          {...field} 
                        />
                      </FormControl>
                    </TabsContent>

                    <TabsContent value="image" className="mt-0">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {platformImages.map((img) => (
                          <div 
                            key={img.value}
                            className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 relative ${
                              currentIcon === img.value ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''
                            }`}
                            onClick={() => selectIcon(img.value)}
                          >
                            <div className="h-16 flex items-center justify-center mb-2">
                              <img 
                                src={img.value} 
                                alt={img.name} 
                                className="max-h-full max-w-full object-contain" 
                              />
                            </div>
                            <span className="text-xs text-center">{img.name}</span>
                            {currentIcon === img.value && (
                              <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="Custom image path (e.g., /images/platforms/custom-icon.png)" 
                          {...field} 
                        />
                      </FormControl>
                    </TabsContent>
                  </Tabs>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Platform description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: field.value }}
                    />
                    <FormControl>
                      <Input placeholder="#RRGGBB" {...field} />
                    </FormControl>
                  </div>
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