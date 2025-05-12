import { createContext, ReactNode, useContext } from "react";
import { User } from "@shared/schema";

const mockUser: User = {
  id: 1,
  username: "Demo User",
  email: "demo@example.com",
  avatarUrl: "https://ui-avatars.com/api/?name=Demo+User&background=7E57C2&color=fff",
  bio: "Demo account",
  isAdmin: true,
  isOwner: true,
  createdAt: new Date()
};

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
  const login = () => {};
  const logout = async () => {};
  const refreshUser = async () => mockUser;

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
        error: null,
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