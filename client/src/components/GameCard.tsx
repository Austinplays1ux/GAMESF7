import { Link } from "wouter";
import { Game, Platform, User } from "@/types";

interface GameCardProps {
  game: Game;
  platform: Platform;
  creator: User;
}

const GameCard: React.FC<GameCardProps> = ({ game, platform, creator }) => {
  const formattedPlays = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(game.plays);

  return (
    <div className="glass-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
      <Link href={`/games/${game.id}`}>
        <a>
          <div className="relative">
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              className="w-full h-48 object-cover"
            />
            <div 
              className="absolute top-2 right-2 text-white px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: platform.color }}
            >
              {platform.name}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold font-montserrat mb-2">{game.title}</h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {game.description}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={creator.avatarUrl || `https://ui-avatars.com/api/?name=${creator.username}&background=007AF4&color=fff`}
                  alt={creator.username}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm text-gray-400">{creator.username}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <i className="fas fa-user mr-1"></i>
                <span>{formattedPlays}</span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default GameCard;
