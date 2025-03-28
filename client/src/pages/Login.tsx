import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertUser } from "@shared/schema";
import Logo from "@/components/Logo";
import { z } from "zod";

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
  const [activeTab, setActiveTab] = useState("login");
  
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

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      // For now just simulate a login - in a real app, this would call an API endpoint
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Login successful!",
        description: "Welcome back to GAMESF7",
      });
      navigate("/home");
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: Omit<SignupFormData, "confirmPassword">) => {
      return await apiRequest<InsertUser>("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      navigate("/home");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
    }
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // For now, just navigate to home without authentication
    // In a real app, this would verify credentials
    loginMutation.mutate(loginForm);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
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

    // For now, just navigate to home page directly to demonstrate functionality
    navigate("/home");
    
    // Uncomment below to enable real signup
    // Remove confirmPassword as it's not in our schema
    /*
    const { confirmPassword, ...userData } = signupForm;
    signupMutation.mutate(userData);
    */
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: `linear-gradient(rgba(22, 8, 47, 0.95), rgba(22, 8, 47, 0.95)), 
                    url('https://cdn.replit.com/_next/static/media/replit-home.a4e6a113.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="text-center mb-10">
        <Logo size="lg" />
        <p className="text-gray-400 mt-4 sofia-pro">The ultimate gaming platform</p>
      </div>

      <Card className="w-full max-w-md bg-[#1a0d36] border-[#2A2A2A] text-white">
        <CardHeader>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#2A2A2A]">
              <TabsTrigger value="login" className="sofia-pro">Log in</TabsTrigger>
              <TabsTrigger value="signup" className="sofia-pro">Sign up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardTitle className="text-xl text-center mb-4 mt-4 sofia-pro">Welcome back</CardTitle>
            </TabsContent>
            
            <TabsContent value="signup">
              <CardTitle className="text-xl text-center mb-4 mt-4 sofia-pro">Create an account</CardTitle>
            </TabsContent>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="sofia-pro">Username</Label>
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
                <Label htmlFor="password" className="sofia-pro">Password</Label>
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
                className="w-full gradient-bg text-white py-5 px-8 rounded-lg text-lg font-semibold sofia-pro"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0">
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username" className="sofia-pro">Username</Label>
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
                <Label htmlFor="signup-email" className="sofia-pro">Email</Label>
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
                <Label htmlFor="signup-password" className="sofia-pro">Password</Label>
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
                <Label htmlFor="signup-confirm" className="sofia-pro">Confirm Password</Label>
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
                className="w-full gradient-bg text-white py-5 px-8 rounded-lg text-lg font-semibold sofia-pro"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;