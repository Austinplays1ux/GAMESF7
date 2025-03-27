import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const CallToAction: React.FC = () => {
  const [, navigate] = useLocation();

  const handleNavigateToCreate = () => {
    navigate("/create");
  };

  const handleWatchTutorial = () => {
    // Would usually open a modal with a tutorial video
    console.log("Open tutorial");
  };

  return (
    <section className="bg-[#1E1E1E] rounded-xl p-8 mb-10">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
          <h2 className="text-2xl font-bold font-poppins mb-3">
            Create and Share Your Own Games
          </h2>
          <p className="text-gray-300 mb-4">
            Build HTML games directly in your browser or share your creations from platforms like 
            Roblox, Fortnite, and RecRoom. Our easy-to-use templates make game development 
            accessible to everyone.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-[#FF5722] hover:bg-opacity-90 text-white font-medium py-2 px-6 rounded-lg transition"
              onClick={handleNavigateToCreate}
            >
              Start Creating
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border border-[#007AF4] text-[#007AF4] hover:bg-[#007AF4]/10 font-medium py-2 px-6 rounded-lg transition"
              onClick={handleWatchTutorial}
            >
              <i className="fas fa-play-circle mr-2"></i>Watch Tutorial
            </Button>
          </div>
        </div>
        <div className="md:w-1/3">
          <img
            src="https://images.unsplash.com/photo-1603481546238-487170aeef7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80"
            alt="Game creation"
            className="rounded-lg w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
