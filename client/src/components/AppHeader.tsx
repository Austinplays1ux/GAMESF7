import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";

const AppHeader: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // For a real app, this would fetch the current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    enabled: false, // Disable this query until we have auth
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#16082F] border-b border-[#2A2A2A]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home">
              <div className="flex items-center">
                <span className="text-white text-2xl font-bold" style={{ 
                  fontFamily: 'Impact, fantasy',
                  letterSpacing: '1px'
                }}>
                  GAMESF7
                </span>
                <span className="ml-2 text-xs text-gray-400">Alpha</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/home">
              <div className={`text-white flex items-center hover:text-gray-300 transition-colors ${location === '/home' ? 'font-medium' : ''}`}>
                <i className="fas fa-home mr-1"></i> Home
              </div>
            </Link>
            <Link href="/discover">
              <div className={`text-white flex items-center hover:text-gray-300 transition-colors ${location === '/discover' ? 'font-medium' : ''}`}>
                <i className="fas fa-compass mr-1"></i> Explore
              </div>
            </Link>
            <Link href="/create">
              <div className={`text-white flex items-center hover:text-gray-300 transition-colors ${location === '/create' ? 'font-medium' : ''}`}>
                <i className="fas fa-plus mr-1"></i> Create
              </div>
            </Link>
            <div className="text-white flex items-center hover:text-gray-300 cursor-pointer transition-colors">
              <i className="fas fa-coins mr-1"></i> Currency
            </div>
          </nav>

          {/* Search */}
          <div className="flex items-center ml-auto mr-4">
            <div className="bg-[#2A2A2A] rounded-full p-2 cursor-pointer">
              <i className="fas fa-search text-white"></i>
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full"
                  src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=7E57C2&color=fff`}
                  alt="User profile"
                />
              </div>
            ) : (
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center cursor-pointer">
                <i className="fas fa-user text-[#16082F]"></i>
              </div>
            )}

            <button
              className="md:hidden p-2 ml-4 text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#16082F]">
          <Link href="/home">
            <div className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A2A2A]">
              <i className="fas fa-home mr-2"></i> Home
            </div>
          </Link>
          <Link href="/discover">
            <div className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A2A2A]">
              <i className="fas fa-compass mr-2"></i> Explore
            </div>
          </Link>
          <Link href="/create">
            <div className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A2A2A]">
              <i className="fas fa-plus mr-2"></i> Create
            </div>
          </Link>
          <div className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#2A2A2A]">
            <i className="fas fa-coins mr-2"></i> Currency
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
