
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
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
