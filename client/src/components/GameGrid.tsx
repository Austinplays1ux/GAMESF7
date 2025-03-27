import { Link } from "wouter";
import GameCard from "./GameCard";
import { useQuery } from "@tanstack/react-query";
import { Game, Platform, User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface GameGridProps {
  title: string;
  endpoint: string;
  viewAllLink?: string;
}

interface GameWithPlatformCreator extends Game {
  platform: Platform;
  creator: User;
}

const GameGrid: React.FC<GameGridProps> = ({ title, endpoint, viewAllLink }) => {
  const { data: games = [], isLoading } = useQuery<GameWithPlatformCreator[]>({
    queryKey: [endpoint],
  });

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-poppins">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <a className="text-[#007AF4] hover:underline">View All</a>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-[#1E1E1E] rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-5/6 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              platform={game.platform}
              creator={game.creator}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default GameGrid;
