import React from 'react';

const Logo = ({ className = "w-6 h-6", color = "currentColor" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* ECG Line */}
      <path d="M 2 12 H 5 L 7 8 L 9 16 L 12 3 L 15 21 L 17 12 H 22" />
      {/* Star Peak Badge */}
      <polygon 
        points="12,1.5 13.5,4.5 17,4.5 14,6.5 15.5,10 12,8 8.5,10 10,6.5 7,4.5 10.5,4.5" 
        fill="currentColor" 
        className="text-amber-500"
      />
    </svg>
  );
};

export default Logo;
