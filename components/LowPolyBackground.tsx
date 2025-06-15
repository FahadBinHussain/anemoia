import React from 'react';

const LowPolyBackground: React.FC = () => {
  return (
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg" 
      className="absolute inset-0 w-full h-full opacity-50"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern 
          id="lowPolyPatternAnemoia" 
          patternUnits="userSpaceOnUse" 
          width="70" 
          height="70" 
          viewBox="0 0 50 50"
          patternTransform="scale(1.4)"
        >
          {/* Adjusted for a slightly darker and less dense pattern */}
          <path d="M0 0 L25 25 L0 50 Z" fill="rgba(6, 182, 212, 0.03)"/> {/* Cyan tint */}
          <path d="M25 25 L50 0 L50 50 Z" fill="rgba(6, 182, 212, 0.04)"/> {/* Cyan tint */}
          <path d="M0 25 L25 0 L50 25 L25 50 Z" fill="rgba(236, 72, 153, 0.02)"/> {/* Pink tint */}
          <path d="M0 0 L50 0 L25 25 Z" fill="rgba(203, 213, 225, 0.01)" />
          <path d="M0 50 L50 50 L25 25 Z" fill="rgba(203, 213, 225, 0.015)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lowPolyPatternAnemoia)" />
    </svg>
  );
};

export default LowPolyBackground;
