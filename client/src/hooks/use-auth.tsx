import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useMutation, UseQueryResult, useQuery } from "@tanstack/react-query";
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
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await apiRequest("GET", "/api/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        // User not logged in, don't show an error
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/login", credentials);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in");
      }
      
      const userData = await response.json();
      setUser(userData);
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error) {
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
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/users", userData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }
      
      const newUser = await response.json();
      setUser(newUser);
      
      toast({
        title: "Account created!",
        description: `Welcome to GAMESF7, ${newUser.username}!`,
      });
    } catch (error) {
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
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/logout");
      
      if (!response.ok) {
        throw new Error("Failed to log out");
      }
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
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
        register
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