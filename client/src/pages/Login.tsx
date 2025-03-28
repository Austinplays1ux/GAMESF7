import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InsertUser } from "@shared/schema";
import { z } from "zod";
import Logo from "@/components/Logo";

type LoginFormData = {
  username: string;
  password: string;
};

type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Login: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    username: "",
    password: ""
  });
  
  // Signup form state
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // For demo purposes, just navigate to home
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Login successful!",
        description: "Welcome back to GAMESF7",
      });
      navigate("/home");
      setIsLoading(false);
    }, 1000);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!signupForm.username || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    const emailSchema = z.string().email();
    try {
      emailSchema.parse(signupForm.email);
    } catch (error) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would send the data to your API
      // In a real app, you would call your API with:
      // const { confirmPassword, ...userData } = signupForm;
      // await apiRequest("/api/users", {
      //   method: "POST",
      //   body: JSON.stringify(userData),
      // });
      
      // For demo purposes, just navigate to home
      setTimeout(() => {
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
        navigate("/home");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row"
      style={{
        background: "#16082F",
      }}
    >
      {/* Left panel with form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-gray-400 mt-4">The ultimate gaming platform</p>
          </div>
          
          <div className="bg-[#1a0d36] border border-[#2A2A2A] rounded-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {isLogin ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-gray-400 mt-2">
                {isLogin 
                  ? "Enter your credentials to access your account" 
                  : "Fill in the information to create your account"}
              </p>
            </div>
            
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full gradient-bg text-white py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
                
                <p className="text-center text-gray-400 mt-4">
                  Don't have an account?{" "}
                  <button 
                    type="button"
                    className="text-purple-400 hover:text-purple-300"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input 
                    id="signup-username" 
                    type="text" 
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    placeholder="Choose a username"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input 
                    id="signup-confirm" 
                    type="password" 
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full gradient-bg text-white py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
                
                <p className="text-center text-gray-400 mt-4">
                  Already have an account?{" "}
                  <button 
                    type="button"
                    className="text-purple-400 hover:text-purple-300"
                    onClick={() => setIsLogin(true)}
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Right panel with hero image/content */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center items-center justify-center p-8"
        style={{
          backgroundImage: "linear-gradient(rgba(22, 8, 47, 0.8), rgba(22, 8, 47, 0.8)), url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')",
        }}
      >
        <div className="max-w-lg text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Build, Play, and Share Amazing Games
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Join the GAMESF7 community and discover games from Roblox, Fortnite, RecRoom, and more. Create and share your own HTML games directly on our platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-purple-900/40 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2 text-white">Discover</h3>
              <p className="text-gray-300">Find new games from all your favorite platforms</p>
            </div>
            <div className="bg-purple-900/40 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2 text-white">Create</h3>
              <p className="text-gray-300">Build and share your own games</p>
            </div>
            <div className="bg-purple-900/40 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2 text-white">Play</h3>
              <p className="text-gray-300">Enjoy games directly in your browser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;