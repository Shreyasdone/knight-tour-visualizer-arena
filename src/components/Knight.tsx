
import React from 'react';

interface KnightProps {
  color?: string;
  className?: string;
  size?: number;
}

const Knight: React.FC<KnightProps> = ({ color = 'currentColor', className = '', size = 24 }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-knight-bounce"
      >
        <path d="M17.5 2H6.5a2 2 0 00-2 2v16a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2z" />
        <path d="M14.5 12L10 7.5V16" />
        <path d="M16.5 18.5A3.5 3.5 0 0113 15a3.5 3.5 0 01-3.5 3.5" />
      </svg>
    </div>
  );
};

export default Knight;
