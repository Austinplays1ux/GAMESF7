import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GameWithDetails } from '@/types';

interface GameCardSectionProps {
  title: string;
  games: GameWithDetails[];
  isLoading: boolean;
  onViewAll?: () => void;
  onGameClick: (game: GameWithDetails) => void;
  emptyGames: Array<{ id: number; title: string; thumbnailUrl: string; }>;
  maxDisplay?: number;
  viewAllLink?: string;
  titleColor?: string;
}

const GameCardSection = ({
  title,
  games,
  isLoading,
  onViewAll,
  onGameClick,
  emptyGames,
  maxDisplay = 4,
  viewAllLink,
  titleColor = 'text-white'
}: GameCardSectionProps) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${titleColor}`}>{title}</h2>
        {viewAllLink && (
          <Button
            variant="link"
            className="text-purple-400 hover:text-purple-300"
            onClick={onViewAll}
          >
            View All <i className="fas fa-chevron-right ml-1"></i>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-4">
          {Array(maxDisplay).fill(0).map((_, i) => (
            <div key={i} className="w-64 rounded-lg overflow-hidden">
              <Skeleton className="w-full h-36" />
              <div className="p-2 bg-[#16082F]">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : (games && games.length > 0) ? (
        <div className="flex flex-wrap gap-4">
          {games.slice(0, maxDisplay).map((game) => (
            <div
              key={game.id}
              className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
              onClick={() => onGameClick(game)}
            >
              <div className="relative">
                <img
                  src={game.thumbnailUrl || `https://placehold.co/400x225/8833FF/FFFFFF?text=${encodeURIComponent(game.title)}`}
                  alt={game.title}
                  className="w-full h-36 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/400x225/8833FF/FFFFFF?text=${encodeURIComponent(game.title)}`;
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white text-xl font-bold">{game.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {emptyGames.slice(0, maxDisplay).map((game) => (
            <div
              key={game.id}
              className="w-64 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="w-full h-36 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/400x225/8833FF/FFFFFF?text=${encodeURIComponent(game.title)}`;
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white text-xl font-bold">{game.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameCardSection;