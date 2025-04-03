
import React from 'react';

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
      <img 
        src="/images/gamesf7-logo.png" 
        alt="GAMESF7 Logo" 
        className={`${sizeClasses[size]} object-contain`} 
      />
    </div>
  );
};

export default Logo;
