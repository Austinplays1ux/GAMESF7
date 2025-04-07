import MultiplayerLobby from '@/components/MultiplayerLobby';

export default function Multiplayer() {
  // Update document title programmatically
  document.title = "Multiplayer Lobby | GAMESF7";
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Multiplayer Lobby</h1>
        <p className="text-zinc-400">
          Chat with other players and join multiplayer gaming sessions
        </p>
      </div>
      
      <MultiplayerLobby />
    </div>
  );
}