import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required.",
  }),
  newPassword: z.string().min(8, {
    message: "New password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationFormSchema = z.object({
  newGames: z.boolean().default(true),
  gameUpdates: z.boolean().default(true),
  friendActivity: z.boolean().default(true),
  directMessages: z.boolean().default(true),
  marketing: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Here would be an API call to update the profile
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    try {
      // Here would be an API call to update the password
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      newGames: true,
      gameUpdates: true,
      friendActivity: true,
      directMessages: true,
      marketing: false,
    },
  });

  const onNotificationSubmit = async (data: NotificationFormValues) => {
    setIsLoading(true);
    try {
      // Here would be an API call to update notification settings
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="mb-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-gray-300 text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings content */}
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="glass-navbar rounded-lg mb-8 p-1 bg-[#16082F]/70">
              <TabsTrigger value="profile" className="sofia-pro data-[state=active]:bg-purple-600/40 data-[state=active]:text-white rounded-md px-6 py-2.5">
                <i className="fas fa-user mr-2"></i> Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="sofia-pro data-[state=active]:bg-purple-600/40 data-[state=active]:text-white rounded-md px-6 py-2.5">
                <i className="fas fa-lock mr-2"></i> Password
              </TabsTrigger>
              <TabsTrigger value="notifications" className="sofia-pro data-[state=active]:bg-purple-600/40 data-[state=active]:text-white rounded-md px-6 py-2.5">
                <i className="fas fa-bell mr-2"></i> Notifications
              </TabsTrigger>
              <TabsTrigger value="account" className="sofia-pro data-[state=active]:bg-purple-600/40 data-[state=active]:text-white rounded-md px-6 py-2.5">
                <i className="fas fa-cog mr-2"></i> Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="glass-panel rounded-xl p-6">
              <div className="flex items-center mb-8">
                <div className="relative mr-6">
                  <img
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=7E57C2&color=fff`}
                    alt={user?.username || "User avatar"}
                    className="w-24 h-24 rounded-full border-2 border-purple-500/50"
                  />
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full border-2 border-[#16082F] cursor-pointer hover:bg-purple-700 transition">
                    <i className="fas fa-camera"></i>
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <p className="text-gray-400">Member since {new Date(user?.createdAt || new Date()).toLocaleDateString()}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="outline" className="bg-purple-900/30 text-purple-300 hover:bg-purple-800/40">
                      <i className="fas fa-gamepad mr-1.5"></i> Gamer
                    </Badge>
                    <Badge variant="outline" className="bg-pink-900/30 text-pink-300 hover:bg-pink-800/40">
                      <i className="fas fa-crown mr-1.5"></i> Alpha Tester
                    </Badge>
                  </div>
                </div>
              </div>

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter username" 
                            className="glass-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter email" 
                            className="glass-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          We'll never share your email with anyone else.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a bit about yourself" 
                            className="glass-input resize-none" 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Brief description for your profile. Max 500 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Avatar URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/avatar.jpg" 
                            className="glass-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Enter URL for your profile picture.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="glass-button bg-purple-600/60 hover:bg-purple-600/80 px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="password" className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Change Password</h2>
              
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Current Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter current password" 
                            className="glass-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter new password" 
                            className="glass-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Password must be at least 8 characters long.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm new password" 
                            className="glass-input" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="glass-button bg-purple-600/60 hover:bg-purple-600/80 px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="notifications" className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
              
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="newGames"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <div>
                            <FormLabel className="text-white text-base font-medium mb-1 block">New Games</FormLabel>
                            <FormDescription className="text-gray-400 text-sm">
                              Get notified when new games are added to the platform
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="gameUpdates"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <div>
                            <FormLabel className="text-white text-base font-medium mb-1 block">Game Updates</FormLabel>
                            <FormDescription className="text-gray-400 text-sm">
                              Receive alerts when games you've played are updated
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="friendActivity"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <div>
                            <FormLabel className="text-white text-base font-medium mb-1 block">Friend Activity</FormLabel>
                            <FormDescription className="text-gray-400 text-sm">
                              Get notified about your friends' activity and achievements
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="directMessages"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <div>
                            <FormLabel className="text-white text-base font-medium mb-1 block">Direct Messages</FormLabel>
                            <FormDescription className="text-gray-400 text-sm">
                              Receive notifications for new direct messages
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="marketing"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <div>
                            <FormLabel className="text-white text-base font-medium mb-1 block">Marketing Emails</FormLabel>
                            <FormDescription className="text-gray-400 text-sm">
                              Receive promotional emails and special offers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="glass-button bg-purple-600/60 hover:bg-purple-600/80 px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="account" className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>
              
              <div className="space-y-8">
                <div className="p-4 border border-yellow-500/30 rounded-lg bg-yellow-950/20">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-yellow-300">
                    <i className="fas fa-crown mr-2"></i> Premium Subscription
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Upgrade to GAMESF7 Premium to unlock exclusive features, remove ads, and get early access to new games.
                  </p>
                  <Button className="glass-button bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-medium">
                    Upgrade to Premium
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Connected Accounts</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 glass-card rounded-lg">
                      <div className="flex items-center">
                        <i className="fab fa-discord text-2xl text-indigo-400 mr-3"></i>
                        <div>
                          <h4 className="font-medium">Discord</h4>
                          <p className="text-sm text-gray-400">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" className="glass-button border-white/10">
                        Connect
                      </Button>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 glass-card rounded-lg">
                      <div className="flex items-center">
                        <i className="fab fa-google text-2xl text-red-400 mr-3"></i>
                        <div>
                          <h4 className="font-medium">Google</h4>
                          <p className="text-sm text-gray-400">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" className="glass-button border-white/10">
                        Connect
                      </Button>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 glass-card rounded-lg">
                      <div className="flex items-center">
                        <i className="fab fa-twitch text-2xl text-purple-400 mr-3"></i>
                        <div>
                          <h4 className="font-medium">Twitch</h4>
                          <p className="text-sm text-gray-400">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" className="glass-button border-white/10">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-3 text-red-400">Danger Zone</h3>
                  <p className="text-gray-300 mb-4">
                    Permanently delete your account and all your data. This action cannot be undone.
                  </p>
                  <Button className="glass-button bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-500/30">
                    <i className="fas fa-trash-alt mr-2"></i> Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;