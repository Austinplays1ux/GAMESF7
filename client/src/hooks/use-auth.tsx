import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Function to fetch current user
  const refreshUser = async () => {
    console.log("Refreshing user session state");
    try {
      // First, check localStorage for a logged in user
      const localStorageUser = localStorage.getItem('currentUser');
      if (localStorageUser) {
        try {
          const userData = JSON.parse(localStorageUser);
          console.log("User found in localStorage:", userData.username);
          setUser(userData);
          return userData;
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
          localStorage.removeItem('currentUser');
        }
      }
      
      // Fallback to API request if no localStorage user
      const userData = await apiRequest<User>("/api/user");
      console.log("User session data received:", userData ? "authenticated" : "unauthenticated");
      if (userData) {
        setUser(userData);
        return userData;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.log("Error refreshing user:", error);
      // Don't show an error toast here - this is called on initial page load
      setUser(null);
      return null;
    }
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.log("Initial auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials: LoginData) => {
    console.log(`Login attempt for: ${credentials.username}`);
    setIsLoading(true);
    setError(null);

    try {
      const userData = await apiRequest<User>("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      
      console.log("Login successful, user data received");
      setUser(userData);
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${userData.username}!`,
      });
      
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred while logging in";
        
      setError(new Error(errorMessage));
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    console.log(`Registration attempt for: ${userData.username}`);
    setIsLoading(true);
    setError(null);

    try {
      const newUser = await apiRequest<User>("/api/users", {
        method: "POST",
        body: JSON.stringify(userData)
      });
      
      console.log("Registration successful, user data received");
      setUser(newUser);
      
      toast({
        title: "Account created!",
        description: `Welcome to GAMESF7, ${newUser.username}!`,
      });
      
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred while creating your account";
        
      setError(new Error(errorMessage));
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log("Logout attempt");
    setIsLoading(true);
    setError(null);

    try {
      // Remove user from localStorage
      localStorage.removeItem('currentUser');
      
      // Also try the API logout to clean up server-side session
      try {
        await apiRequest("/api/logout", {
          method: "POST"
        });
      } catch (e) {
        console.log("API logout failed, but continuing with client-side logout");
      }
      
      console.log("Logout successful");
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
    } catch (error) {
      console.error("Logout error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred while logging out";
        
      setError(new Error(errorMessage));
      
      toast({
        title: "Logout failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        register,
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