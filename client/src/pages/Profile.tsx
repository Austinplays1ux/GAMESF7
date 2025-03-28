
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-purple-900/20 rounded-lg p-6 backdrop-blur-md border border-purple-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=7E57C2&color=fff`} 
                alt={user.username} 
              />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{user.username}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2 gradient-text">About</h2>
              <p className="text-gray-300">
                {user.bio || "No bio yet"}
              </p>
            </div>
            
            <Link href="/settings">
              <Button className="w-full glass-button">
                <i className="fas fa-cog mr-2"></i>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
