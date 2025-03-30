import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: `linear-gradient(rgba(13, 4, 31, 0.9), rgba(13, 4, 31, 0.95)), 
                    url('/images/games-collage-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      {/* Glassmorphic background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-6xl md:text-7xl font-bold mb-12" 
            style={{ 
              fontFamily: 'Sofia Pro Soft, sans-serif',
              background: 'linear-gradient(to right, #fff, #e0e0e0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          GAMESF7
        </h1>

        <div className="flex flex-col gap-4 items-center max-w-xs mx-auto">
          <Button 
            onClick={() => navigate("/login")}
            className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300 rounded-xl"
          >
            Log in
          </Button>
          <Button 
            onClick={() => navigate("/signup")}
            className="w-full py-6 text-lg bg-transparent border-2 border-purple-500 hover:bg-purple-500/20 transition-all duration-300 rounded-xl"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;