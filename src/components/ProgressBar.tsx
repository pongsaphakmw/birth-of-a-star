import React from 'react';

type ProgressBarProps = {
  label: string;
  value?: number;  // Changed from current
  maxValue?: number;  // Changed from max
  color: string;
  rate?: number;  // Added rate prop
};

export default function ProgressBar({ 
  label, 
  value = 0,  // Renamed and added default
  maxValue = 100,  // Renamed and added default
  color,
  rate = 0  // Added with default
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100);
  const isComplete = value >= maxValue;
  
  // Dynamically determine color based on the color prop
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'amber':
        return 'bg-amber-500';
      case 'red':
        return 'bg-red-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Add pulsing animation when bar is full
  const getAnimationClass = () => {
    if (isComplete) {
      return 'animate-pulse';
    }
    return '';
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="text-white text-sm font-medium">{label}</span>
          {isComplete && (
            <span className="ml-2 text-xs text-green-400 animate-pulse">
              ✓ Complete!
            </span>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-white text-xs">{`${value}/${maxValue}`}</span>
          <span className="text-white text-xs ml-1">{`(${percentage}%)`}</span>
          {rate > 0 && (
            <span className="text-green-400 text-xs ml-2">+{rate}/s</span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 relative">
        {/* Target line indicator */}
        <div 
          className="absolute h-full w-0.5 bg-white/50 z-10"
          style={{ left: `${100}%` }}
        />
        
        {/* Progress fill */}
        <div
          className={`${getColorClass()} ${getAnimationClass()} h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shimmer effect on progress bar */}
          <div className="absolute inset-0 w-full h-full">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      {/* Add tailwind animation class for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}