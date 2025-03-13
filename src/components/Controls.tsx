'use client';

import React from 'react';
import ProgressBar from './ProgressBar';

type ControlsProps = {
  temperature: number;
  gravity: number;
  temperatureTarget: number;
  gravityTarget: number;
  onTemperatureChange: (value: number) => void;
  onGravityChange: (value: number) => void;
};

export default function Controls({
  temperature,
  gravity,
  temperatureTarget,
  gravityTarget,
  onTemperatureChange,
  onGravityChange
}: ControlsProps) {
  // Visual feedback based on how close you are to optimal values
  const getFeedback = (current: number, target: number) => {
    const ratio = current / target;
    
    if (ratio < 0.5) return "Too low!";
    if (ratio < 0.8) return "Getting closer...";
    if (ratio <= 1.2) return "Perfect!";
    if (ratio <= 1.5) return "Careful, too high!";
    return "DANGER: Unstable!";
  };
  
  const getTemperatureFeedbackColor = () => {
    const ratio = temperature / temperatureTarget;
    
    if (ratio < 0.8) return "text-blue-400";
    if (ratio <= 1.2) return "text-green-400";
    return "text-red-400";
  };
  
  const getGravityFeedbackColor = () => {
    const ratio = gravity / gravityTarget;
    
    if (ratio < 0.8) return "text-blue-400";
    if (ratio <= 1.2) return "text-green-400";
    return "text-red-400";
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-white text-center text-lg mb-2">Control Star Formation</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="temperature" className="text-white">Temperature</label>
            <span className={getTemperatureFeedbackColor()}>
              {getFeedback(temperature, temperatureTarget)}
            </span>
          </div>
          <input
            id="temperature"
            type="range"
            min="0"
            max="150"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <ProgressBar
            label=""
            current={temperature}
            max={temperatureTarget}
            color={temperature > temperatureTarget * 1.2 ? "red" : "blue"}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="gravity" className="text-white">Gravity</label>
            <span className={getGravityFeedbackColor()}>
              {getFeedback(gravity, gravityTarget)}
            </span>
          </div>
          <input
            id="gravity"
            type="range"
            min="0"
            max="140"
            value={gravity}
            onChange={(e) => onGravityChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <ProgressBar
            label=""
            current={gravity}
            max={gravityTarget}
            color={gravity > gravityTarget * 1.2 ? "red" : "green"}
          />
        </div>
      </div>
      
      <div className="text-white text-sm mt-2">
        <p className="text-center">Balance temperature and gravity to form your star!</p>
        <p className="text-center text-amber-300 text-xs mt-1">
          (Keep both values in the "Perfect!" range)
        </p>
      </div>
    </div>
  );
}