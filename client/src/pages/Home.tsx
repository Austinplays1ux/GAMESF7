import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Logo from "../components/Logo";

const Home = () => {
  const [, navigate] = useLocation();

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(rgba(13, 4, 31, 0.9), rgba(13, 4, 31, 0.95)), 
                    url('/images/games-collage-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

      {/* Glassmorphic background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Logo size="xl" className="mx-auto mb-8" />
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            GAMESF7
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Your ultimate gaming platform. Play and share games from Roblox, Fortnite, RecRoom and more!
          </p>
          <div className="flex justify-center gap-6">
            <Button 
              onClick={() => navigate('/login')}
              className="glass-button bg-purple-600/60 hover:bg-purple-600/80 px-8 py-3 text-lg"
            >
              Log in
            </Button>
            <Button 
              onClick={() => navigate('/auth/signup')}
              className="glass-button bg-pink-600/60 hover:bg-pink-600/80 px-8 py-3 text-lg"
            >
              Sign up
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-xl text-center">
            <i className="fas fa-gamepad text-4xl text-purple-400 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Play Games</h3>
            <p className="text-gray-400">Access thousands of games from popular platforms</p>
          </div>
          <div className="glass-card p-6 rounded-xl text-center">
            <i className="fas fa-share-alt text-4xl text-blue-400 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Share & Connect</h3>
            <p className="text-gray-400">Build your gaming community and share experiences</p>
          </div>
          <div className="glass-card p-6 rounded-xl text-center">
            <i className="fas fa-trophy text-4xl text-yellow-400 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Earn Rewards</h3>
            <p className="text-gray-400">Get achievements and climb the leaderboards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;