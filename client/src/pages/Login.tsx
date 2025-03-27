import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const [, navigate] = useLocation();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
                    url('https://cdn.replit.com/_next/static/media/replit-home.a4e6a113.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-white font-bold" style={{ 
            fontFamily: 'Impact, fantasy',
            letterSpacing: '2px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            GAMESF7
          </span>
        </h1>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col space-y-4">
          <Button 
            className="bg-purple-900 hover:bg-purple-800 text-white py-6 px-8 rounded-lg text-lg font-semibold w-full"
            onClick={() => navigate("/home")}
          >
            Log in
          </Button>
          
          <Button 
            className="bg-purple-900 hover:bg-purple-800 text-white py-6 px-8 rounded-lg text-lg font-semibold w-full"
            onClick={() => navigate("/home")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;