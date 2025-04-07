
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BloxdIo() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameUrl = "https://bloxd.io";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFullscreen = () => {
    const iframe = document.getElementById("bloxd-iframe") as HTMLIFrameElement;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Bloxd.io</h1>
          <Button
            onClick={handleFullscreen}
            variant="outline"
            className="glass-button"
            disabled={isLoading}
          >
            <i className="fas fa-expand mr-2"></i> Fullscreen
          </Button>
        </div>

        <Card className="overflow-hidden bg-zinc-900/40 border-zinc-800">
          {isLoading ? (
            <div className="aspect-video w-full flex items-center justify-center bg-zinc-900/80">
              <div className="text-center">
                <div className="relative mx-auto mb-6">
                  <img 
                    src="/images/games/bloxd-io.png"
                    alt="Bloxd.io"
                    className="w-full max-w-[300px] h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="loading-spinner"></div>
                </div>
                <p className="mt-4 text-zinc-400">Loading game...</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full">
              <iframe
                id="bloxd-iframe"
                src={gameUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                title="Bloxd.io"
              ></iframe>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-zinc-900/40 border-zinc-800">
            <h2 className="text-xl font-bold mb-4">About Bloxd.io</h2>
            <p className="text-zinc-300">
              Bloxd.io is a multiplayer voxel-based building and exploration game where players can create,
              collaborate, and compete in various game modes. Build structures, play mini-games,
              and interact with other players in this online sandbox environment.
            </p>
          </Card>

          <Card className="p-6 bg-zinc-900/40 border-zinc-800">
            <h2 className="text-xl font-bold mb-4">Controls</h2>
            <ul className="space-y-2 text-zinc-300">
              <li><span className="font-semibold">WASD</span> - Move character</li>
              <li><span className="font-semibold">Mouse</span> - Look around</li>
              <li><span className="font-semibold">Left Click</span> - Place blocks</li>
              <li><span className="font-semibold">Right Click</span> - Remove blocks</li>
              <li><span className="font-semibold">Space</span> - Jump</li>
              <li><span className="font-semibold">Tab</span> - Open inventory</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
