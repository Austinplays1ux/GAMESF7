import { useState, useRef, KeyboardEvent } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import Logo from "./Logo";

const AppHeader: React.FC = () => {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };
  
  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center mr-4">
            <Link href="/home">
              <div className="flex items-center">
                <Logo size="sm" />
              </div>
            </Link>
          </div>

          {/* Combined Nav and Search in Center */}
          <div className="flex flex-1 justify-center items-center">
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6 mr-4">
              <Link href="/home">
                <div className={`text-white sofia-pro flex items-center hover:text-gray-300 transition-colors ${location === '/home' ? 'font-medium' : ''}`}>
                  <i className="fas fa-home mr-2"></i> Home
                </div>
              </Link>
              <Link href="/discover">
                <div className={`text-white sofia-pro flex items-center hover:text-gray-300 transition-colors ${location === '/discover' ? 'font-medium' : ''}`}>
                  <i className="fas fa-compass mr-2"></i> Explore
                </div>
              </Link>
              <Link href="/create">
                <div className={`text-white sofia-pro flex items-center hover:text-gray-300 transition-colors ${location === '/create' ? 'font-medium' : ''}`}>
                  <i className="fas fa-plus-circle mr-2"></i> Create
                </div>
              </Link>
              <div className="text-white sofia-pro flex items-center hover:text-gray-300 cursor-pointer transition-colors">
                <i className="fas fa-coins mr-2"></i> Currency
              </div>
            </nav>

            {/* Search */}
            <div className="flex items-center">
              <div className="relative flex items-center">
                <Input 
                  type="text"
                  placeholder="Search..." 
                  className="glass-input text-white h-9 pl-10 pr-4 rounded-full focus:ring-2 focus:ring-purple-500 focus:outline-none w-44 sofia-pro"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                >
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Auth buttons / User profile */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 w-9 rounded-full overflow-hidden border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    <img
                      className="h-full w-full object-cover"
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=7E57C2&color=fff`}
                      alt={user.username}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-dropdown min-w-[200px] p-2" align="end">
                  <div className="px-2 py-1.5 text-sm font-medium gradient-text">
                    {user.username}
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <Link href="/profile">
                    <DropdownMenuItem className="flex items-center cursor-pointer">
                      <i className="fas fa-user mr-2"></i> Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="flex items-center cursor-pointer">
                      <i className="fas fa-cog mr-2"></i> Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/my-games">
                    <DropdownMenuItem className="flex items-center cursor-pointer">
                      <i className="fas fa-gamepad mr-2"></i> My Games
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="flex items-center text-red-400 cursor-pointer" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" className="glass-button text-white border-white/10">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="glass-button bg-purple-600/60 hover:bg-purple-600/80 text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
            
            <button
              className="md:hidden p-2 text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-dark">
          <Link href="/home">
            <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-purple-900/30 glass-button">
              <i className="fas fa-home mr-2"></i> Home
            </div>
          </Link>
          <Link href="/discover">
            <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-purple-900/30 glass-button">
              <i className="fas fa-compass mr-2"></i> Explore
            </div>
          </Link>
          <Link href="/create">
            <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-purple-900/30 glass-button">
              <i className="fas fa-plus-circle mr-2"></i> Create
            </div>
          </Link>
          <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-purple-900/30 glass-button">
            <i className="fas fa-coins mr-2"></i> Currency
          </div>
          
          {!user ? (
            <>
              <Link href="/login">
                <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-purple-900/30 glass-button">
                  <i className="fas fa-sign-in-alt mr-2"></i> Log in
                </div>
              </Link>
              <Link href="/signup">
                <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro gradient-text hover:bg-purple-900/30 glass-button">
                  <i className="fas fa-user-plus mr-2"></i> Sign up
                </div>
              </Link>
            </>
          ) : (
            <div 
              className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-red-400 hover:bg-purple-900/30 glass-button"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
