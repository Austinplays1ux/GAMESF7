import { useState } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
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
    <header className="sticky top-0 z-50 bg-[#1E1E1E] border-b border-[#2A2A2A]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Logo />
              </a>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/discover">
              <a className={`text-white hover:text-[#007AF4] font-medium transition-colors ${location === '/discover' ? 'text-[#007AF4]' : ''}`}>
                Discover
              </a>
            </Link>
            <Link href="/create">
              <a className={`text-white hover:text-[#007AF4] font-medium transition-colors ${location === '/create' ? 'text-[#007AF4]' : ''}`}>
                Create
              </a>
            </Link>
            <a href="#" className="text-white hover:text-[#007AF4] font-medium transition-colors">
              Community
            </a>
            <a href="#" className="text-white hover:text-[#007AF4] font-medium transition-colors">
              Support
            </a>
          </nav>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search games, creators..."
                className="w-full bg-[#2A2A2A] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#007AF4]"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>

          {/* User controls */}
          <div className="flex items-center space-x-4">
            <button className="relative p-1 rounded-full hover:bg-[#2A2A2A]">
              <i className="fas fa-bell text-lg"></i>
              {/* If there are notifications, show count */}
              <span className="absolute top-0 right-0 bg-[#FF5722] text-xs w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#007AF4]">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=007AF4&color=fff`}
                    alt="User profile"
                  />
                </button>
                {/* User dropdown menu would be here */}
              </div>
            ) : (
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            )}

            <button
              className="md:hidden p-2 rounded-md hover:bg-[#2A2A2A] focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/discover">
            <a className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A2A2A]">
              Discover
            </a>
          </Link>
          <Link href="/create">
            <a className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A2A2A]">
              Create
            </a>
          </Link>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A2A2A]">
            Community
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A2A2A]">
            Support
          </a>
        </div>
        {currentUser && (
          <div className="pt-4 pb-3 border-t border-[#2A2A2A]">
            <div className="px-4 flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=007AF4&color=fff`}
                  alt="User profile"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{currentUser.username}</div>
                <div className="text-sm text-gray-400">{currentUser.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
