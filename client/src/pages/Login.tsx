import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/Logo";
import type { LoginFormData, SignupFormData } from "@/types";

const Login: React.FC = () => {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/auth/:mode?');
  const { toast } = useToast();
  const { user, login, register, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (match && params && params.mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [match, params]);

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    username: "",
    password: ""
  });

  const [signupForm, setSignupForm] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

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
    
    setIsLoading(true);
    
    try {
      await login(loginForm);
      // Navigate is handled by the useEffect hook that watches for user changes
    } catch (error) {
      // Error handling is done in the login function
    } finally {
      setIsLoading(false);
    }
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
      const { confirmPassword, ...userData } = signupForm;
      await register(userData);
      // Navigate is handled by the useEffect hook that watches for user changes
    } catch (error) {
      // Error handling is done in the register function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "#0c041c",
      }}
    >
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-gray-400 mt-4">The ultimate gaming platform</p>
        </div>

        <div className="glass-modal rounded-lg p-8 shadow-xl">
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
                  className="glass-input"
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
                  className="glass-input"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>

              <Button 
                type="submit"
                className="w-full glass-button text-white py-2"
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
                  className="glass-input"
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
                  className="glass-input"
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
                  className="glass-input"
                  placeholder="Choose a password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input 
                  id="signup-confirm-password" 
                  type="password" 
                  className="glass-input"
                  placeholder="Confirm your password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                />
              </div>

              <Button 
                type="submit"
                className="w-full glass-button text-white py-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
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
  );
};

export default Login;