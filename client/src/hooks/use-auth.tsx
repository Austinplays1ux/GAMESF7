import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const refreshUser = async () => {
    try {
      const response = await fetch('/__replauthuser');
      const userData = await response.json();

      if (userData) {
        const user = {
          id: parseInt(userData.id),
          username: userData.name,
          email: `${userData.name}@replit.com`,
          avatarUrl: userData.profileImage,
          bio: userData.bio || '',
          isAdmin: userData.roles?.includes('admin') || false,
          isOwner: userData.roles?.includes('owner') || false,
          createdAt: new Date()
        };

        setUser(user);
        return user;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.log("Error refreshing user:", error);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  const login = () => {
    window.addEventListener("message", authComplete);
    const h = 500;
    const w = 350;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;

    const authWindow = window.open(
      `https://replit.com/auth_with_repl_site?domain=${location.host}`,
      "_blank",
      `modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
    );

    function authComplete(e: MessageEvent) {
      if (e.data !== "auth_complete") {
        return;
      }

      window.removeEventListener("message", authComplete);
      authWindow?.close();

      refreshUser().then((user) => {
        if (user) {
          toast({
            title: "Login successful!",
            description: `Welcome back, ${user.username}!`,
          });
          queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        }
      });
    }
  };

  const logout = async () => {
    try {
      await fetch('/__replauthlogout');
      setUser(null);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}