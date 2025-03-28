import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ size = "md" }) => {
  const dimensions = {
    sm: { width: 120, height: 30 },
    md: { width: 160, height: 40 },
    lg: { width: 200, height: 50 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className="flex items-center">
      <img 
        src="/images/gamesf7-logo.svg" 
        alt="GAMESF7 Logo" 
        width={width} 
        height={height}
        className="gradient-text"
      />
    </div>
  );
};

export default Logo;
