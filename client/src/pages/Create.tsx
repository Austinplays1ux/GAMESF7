import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Platform } from "@/types";
import { Button } from "@/components/ui/button";
import CreateGameModal from "@/components/CreateGameModal";

const Create: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Create & Share Your Games
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Build HTML games or share your existing games from popular platforms
          </p>
          <Button
            className="bg-[#FF5722] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-lg"
            onClick={handleOpenCreateModal}
          >
            <i className="fas fa-plus mr-2"></i> Create New Game
          </Button>
        </div>

        <div className="glass-card rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-6 gradient-text">Supported Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-start">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full mr-4 flex-shrink-0"
                  style={{ backgroundColor: `${platform.color}20` }}
                >
                  {platform.icon.startsWith('/') ? (
                    <img src={platform.icon} alt={platform.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <i className={`${platform.icon} text-2xl`} style={{ color: platform.color }}></i>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat mb-2">{platform.name} Games</h3>
                  <p className="text-gray-400 text-sm">{platform.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-6 gradient-text">HTML Game Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-lg p-5 hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#007AF4]/20 rounded-full mx-auto mb-4">
                <i className="fas fa-running text-3xl text-[#007AF4]"></i>
              </div>
              <h3 className="text-lg font-semibold font-montserrat mb-2">Platformer</h3>
              <p className="text-gray-400 text-sm mb-4">Jump and run through obstacles and collect items</p>
              <Button variant="outline" className="glass-button text-[#007AF4] border-[#007AF4]" onClick={handleOpenCreateModal}>
                Use Template
              </Button>
            </div>

            <div className="glass-card rounded-lg p-5 hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#6C2FF2]/20 rounded-full mx-auto mb-4">
                <i className="fas fa-puzzle-piece text-3xl text-[#6C2FF2]"></i>
              </div>
              <h3 className="text-lg font-semibold font-montserrat mb-2">Puzzle</h3>
              <p className="text-gray-400 text-sm mb-4">Challenge the mind with logical puzzles</p>
              <Button variant="outline" className="glass-button text-[#6C2FF2] border-[#6C2FF2]" onClick={handleOpenCreateModal}>
                Use Template
              </Button>
            </div>

            <div className="glass-card rounded-lg p-5 hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-[#FF5722]/20 rounded-full mx-auto mb-4">
                <i className="fas fa-crosshairs text-3xl text-[#FF5722]"></i>
              </div>
              <h3 className="text-lg font-semibold font-montserrat mb-2">Shooter</h3>
              <p className="text-gray-400 text-sm mb-4">Fast-paced action with shooting mechanics</p>
              <Button variant="outline" className="glass-button text-[#FF5722] border-[#FF5722]" onClick={handleOpenCreateModal}>
                Use Template
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#007AF4] to-[#6C2FF2] rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold font-poppins mb-3">Ready to start creating?</h2>
              <p className="text-white mb-4">
                Use our templates or start from scratch. Share your creations with players around the world.
              </p>
              <Button 
                className="bg-white text-[#007AF4] hover:bg-opacity-90 font-medium" 
                onClick={handleOpenCreateModal}
              >
                Get Started Now
              </Button>
            </div>
            <div className="md:w-1/3 mt-6 md:mt-0 text-center">
              <i className="fas fa-code text-8xl text-white opacity-75"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Create Game Modal */}
      <CreateGameModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
    </div>
  );
};

export default Create;
