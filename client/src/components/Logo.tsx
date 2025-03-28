import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ size = "md" }) => {
  const dimensions = {
    sm: { width: 24, height: 24, fontSize: "text-lg" },
    md: { width: 32, height: 32, fontSize: "text-xl" },
    lg: { width: 48, height: 48, fontSize: "text-2xl" },
  };

  const { width, height, fontSize } = dimensions[size];

  return (
    <div className="flex items-center">
      <svg
        className="mr-2"
        viewBox="0 0 16.63 17.5"
        width={width}
        height={height}
      >
        <defs>
          <style>
            {
              ".cls-1,.cls-2{fill:#007AF4;stroke:#003080;stroke-linecap:round;stroke-linejoin:round;}.cls-2{stroke-width:1.5px;}"
            }
          </style>
        </defs>
        <path
          className="cls-1"
          d="M.75,2A6.44,6.44,0,0,1,8.44,2h0a6.44,6.44,0,0,0,7.69,0V12.4a6.44,6.44,0,0,1-7.69,0h0a6.44,6.44,0,0,0-7.69,0"
        />
        <line className="cls-2" x1="0.75" y1="16.75" x2="0.75" y2="0.75" />
      </svg>
      <span className={`${fontSize} roblox-font font-bold tracking-wide gradient-text`}>
        GAMESF7
      </span>
    </div>
  );
};

export default Logo;
