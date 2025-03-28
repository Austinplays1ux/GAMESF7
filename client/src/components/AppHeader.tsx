import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";

import Logo from "./Logo";

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
                <Logo size="sm" />
                <span className="ml-2 text-xs text-gray-400">Alpha</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
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
          <div className="flex items-center ml-auto mr-4">
            <div className="relative flex items-center">
              <Input 
                type="text"
                placeholder="Search..." 
                className="bg-[#2A2A2A] border-none text-white h-9 pl-10 pr-4 rounded-full focus:ring-2 focus:ring-purple-500 focus:outline-none w-44 sofia-pro"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
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
            <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-[#2A2A2A]">
              <i className="fas fa-home mr-2"></i> Home
            </div>
          </Link>
          <Link href="/discover">
            <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-[#2A2A2A]">
              <i className="fas fa-compass mr-2"></i> Explore
            </div>
          </Link>
          <Link href="/create">
            <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-[#2A2A2A]">
              <i className="fas fa-plus-circle mr-2"></i> Create
            </div>
          </Link>
          <div className="block px-3 py-2 rounded-md text-base font-medium sofia-pro text-white hover:bg-[#2A2A2A]">
            <i className="fas fa-coins mr-2"></i> Currency
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
