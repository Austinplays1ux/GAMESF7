
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/images/gamesf7-logo.png" 
        alt="GAMESF7 Logo" 
        className="h-8 object-contain" 
      />
    </div>
  );
};

export default Logo;
