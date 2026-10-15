import React from 'react';

interface PixLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: string;
}

export const PixIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central diamond */}
      <rect
        x="36"
        y="36"
        width="28"
        height="28"
        rx="6"
        transform="rotate(45 50 50)"
        fill="#00D4AA"
      />
      {/* Top petal */}
      <rect
        x="38"
        y="12"
        width="24"
        height="24"
        rx="6"
        transform="rotate(45 50 24)"
        fill="#00C49F"
        opacity="0.9"
      />
      {/* Bottom petal */}
      <rect
        x="38"
        y="64"
        width="24"
        height="24"
        rx="6"
        transform="rotate(45 50 76)"
        fill="#00C49F"
        opacity="0.9"
      />
      {/* Left petal */}
      <rect
        x="12"
        y="38"
        width="24"
        height="24"
        rx="6"
        transform="rotate(45 24 50)"
        fill="#00E5BA"
        opacity="0.9"
      />
      {/* Right petal */}
      <rect
        x="64"
        y="38"
        width="24"
        height="24"
        rx="6"
        transform="rotate(45 76 50)"
        fill="#00E5BA"
        opacity="0.9"
      />
    </svg>
  );
};

export const PixLogo: React.FC<PixLogoProps> = ({
  className = '',
  size = 32,
  showText = true,
  textSize = 'text-2xl',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <PixIcon size={size} />
      {showText && (
        <span className={`font-bold tracking-tight text-white ${textSize} lowercase select-none`}>
          pix
        </span>
      )}
    </div>
  );
};
