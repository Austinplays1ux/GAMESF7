import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const HeroSection: React.FC = () => {
  const [, navigate] = useLocation();

  const handleCreateGame = () => {
    navigate("/create");
  };

  const handleBrowseGames = () => {
    navigate("/discover");
  };

  return (
    <section className="rounded-xl bg-gradient-to-r from-[#007AF4] to-[#6C2FF2] overflow-hidden mb-10">
      <div className="flex flex-col md:flex-row items-center">
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Share & Play Games Together
          </h1>
          <p className="text-lg mb-6">
            Upload your own games or play others from RecRoom, Roblox, Fortnite, and more!
          </p>
          <div className="flex space-x-4">
            <Button 
              className="bg-[#FF5722] hover:bg-opacity-90 text-white font-medium py-2 px-6 rounded-lg transition"
              onClick={handleCreateGame}
            >
              Create Game
            </Button>
            <Button 
              variant="outline" 
              className="bg-dark border border-white hover:bg-[#2A2A2A] text-white font-medium py-2 px-6 rounded-lg transition"
              onClick={handleBrowseGames}
            >
              Browse Games
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
            alt="Gaming together"
            className="w-full h-64 md:h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
