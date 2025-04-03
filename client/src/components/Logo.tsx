
import React from 'react';
import logoImage from '@assets/Untitled design.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary rounded-md p-1">
        <img 
          src={logoImage} 
          alt="GAMESF7 Logo" 
          className={`${sizeClasses[size]} object-contain`} 
        />
      </div>
      <span className="font-bold text-lg tracking-tight">GAMESF7</span>
    </div>
  );
};

export default Logo;
