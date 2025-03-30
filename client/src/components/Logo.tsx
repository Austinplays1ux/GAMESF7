
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
      <span className="font-bold text-xl">GameShare</span>
    </div>
  );
};

export default Logo;
