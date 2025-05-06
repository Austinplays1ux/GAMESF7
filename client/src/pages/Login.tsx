import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";

const Login: React.FC = () => {
  const [, navigate] = useLocation();
  const { user, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row"
      style={{
        background: "#0c041c",
      }}
    >
      {/* Left panel with login button */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-gray-400 mt-4">The ultimate gaming platform</p>
          </div>

          <div className="glass-modal rounded-lg p-8 shadow-xl text-center">
            <h2 className="text-2xl font-bold gradient-text mb-6">
              Welcome to GAMESF7
            </h2>
            <p className="text-gray-400 mb-8">
              Log in with your Replit account to continue
            </p>

            <button 
              onClick={login}
              className="w-full glass-button text-white py-3 px-6 rounded-lg text-lg font-semibold"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Login with Replit
            </button>
          </div>
        </div>
      </div>

      {/* Right panel with hero image/content */}
      <div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center items-center justify-center p-8"
        style={{
          backgroundImage: "linear-gradient(rgba(12, 4, 28, 0.9), rgba(12, 4, 28, 0.9)), url('/images/sprunk-games-bg.jpg')",
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