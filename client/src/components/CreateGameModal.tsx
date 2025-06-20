
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  gameType: z.enum(["url", "html"], { 
    required_error: "Please select a game type" 
  }),
  gameUrl: z.string().url("Please enter a valid URL").optional(),
  htmlContent: z.string().min(1, "HTML content is required").optional(),
  thumbnailUrl: z.string().url("Please enter a valid thumbnail URL"),
}).refine((data) => {
  if (data.gameType === "url") {
    return !!data.gameUrl;
  } else {
    return !!data.htmlContent;
  }
}, {
  message: "Please provide either a Game URL or HTML content based on your selection",
  path: ["gameUrl"],
});

type CreateGameFormValues = z.infer<typeof createGameSchema>;

export default function CreateGameModal({ isOpen, onClose, onSuccess }: CreateGameModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateGameFormValues>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      categoryIds: [],
      gameType: "url",
      gameUrl: "",
      htmlContent: "",
    },
  });

  const { data: platforms = [] } = useQuery({
    queryKey: ['/api/platforms'],
    queryFn: async () => {
      const res = await fetch('/api/platforms');
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      return res.json();
    },
  });

  const onSubmit = async (values: CreateGameFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...values,
        creatorId: user.id,
        platformId: parseInt(values.platformId),
        categoryIds: values.categoryIds.map(id => parseInt(id)),
        gameUrl: values.gameType === "url" ? values.gameUrl : "",
        htmlContent: values.gameType === "html" ? values.htmlContent : "",
      };

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      toast({
        title: "Success!",
        description: "Game created successfully",
      });

      onSuccess?.();
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="platformId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platforms.map((platform: any) => (
                          <SelectItem key={platform.id} value={platform.id.toString()}>
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter game title" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter game description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Categories</FormLabel>
                <div className="glass-input border rounded-md p-2">
                  <ScrollArea className="h-36">
                    <div className="space-y-2 p-2">
                    {categories.map((category: any) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categoryIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-start space-x-3 space-y-0 p-1 rounded-md hover:bg-purple-600/10"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.id.toString())}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...field.value || []];
                                    if (checked) {
                                      if (!currentValue.includes(category.id.toString())) {
                                        field.onChange([...currentValue, category.id.toString()]);
                                      }
                                    } else {
                                      field.onChange(
                                        currentValue.filter((value) => value !== category.id.toString())
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-white cursor-pointer">
                                <i className={`${category.icon} mr-2`}></i>
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    </div>
                  </ScrollArea>
                </div>
                {form.formState.errors.categoryIds && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.categoryIds.message}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="gameType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Type</FormLabel>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="url-option"
                          value="url"
                          checked={field.value === "url"}
                          onChange={() => field.onChange("url")}
                          className="w-4 h-4 accent-purple-600"
                        />
                        <label htmlFor="url-option" className="cursor-pointer">Website URL</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="html-option"
                          value="html"
                          checked={field.value === "html"}
                          onChange={() => field.onChange("html")}
                          className="w-4 h-4 accent-purple-600"
                        />
                        <label htmlFor="html-option" className="cursor-pointer">HTML Content</label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("gameType") === "url" && (
                <FormField
                  control={form.control}
                  name="gameUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter game URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("gameType") === "html" && (
                <FormField
                  control={form.control}
                  name="htmlContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HTML Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter HTML content for your game" 
                          {...field} 
                          className="min-h-[150px] font-mono text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter thumbnail URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Game'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
