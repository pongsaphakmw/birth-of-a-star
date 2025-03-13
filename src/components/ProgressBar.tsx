import React from 'react';

type ProgressBarProps = {
  label: string;
  current: number;
  max: number;
  color: string;
};

export default function ProgressBar({ 
  label, 
  current, 
  max, 
  color 
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  
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
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white text-sm font-medium">{label}</span>
        <span className="text-white text-xs">{`${percentage}%`}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={`${getColorClass()} h-2.5 rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}