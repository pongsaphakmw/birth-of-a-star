'use client';
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

type ControlsProps = {
  temperature: number;
  gravity: number;
  temperatureTarget: number;
  gravityTarget: number;
  onTemperatureChange: (value: number) => void;
  onGravityChange: (value: number) => void;
  onIgnite?: () => void; // Added for manual ignition
};

export default function Controls({
  temperature,
  gravity,
  temperatureTarget,
  gravityTarget,
  onTemperatureChange,
  onGravityChange,
  onIgnite
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

  // Get numerical representation for display
  const getTemperatureValue = () => {
    // Convert to a more intuitive range (e.g., millions of degrees)
    const ratio = temperature / temperatureTarget;
    const baseTemp = 10; // million K
    return Math.round(baseTemp * ratio * 10) / 10; // One decimal place
  };

  const getGravityValue = () => {
    // Convert to a relative value
    const ratio = gravity / gravityTarget;
    return Math.round(ratio * 100) / 100; // Two decimal places
  };

  // Get color class for slider track
  const getSliderTrackClass = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio < 0.8) return "bg-blue-500";
    if (ratio <= 1.2) return "bg-green-500";
    if (ratio <= 1.5) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Star formation visual state
  const [starPulse, setStarPulse] = useState(false);
  
  // Update star pulse effect when values change
  React.useEffect(() => {
    const tempRatio = temperature / temperatureTarget;
    const gravRatio = gravity / gravityTarget;
    
    // Pulse when both values are in "perfect" range
    if (tempRatio >= 0.8 && tempRatio <= 1.2 && 
        gravRatio >= 0.8 && gravRatio <= 1.2) {
      setStarPulse(true);
    } else {
      setStarPulse(false);
    }
  }, [temperature, gravity, temperatureTarget, gravityTarget]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center mb-4">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-500 flex items-center justify-center ${starPulse ? 'animate-pulse' : ''}`}
          style={{
            background: `radial-gradient(circle, 
              rgba(255,${Math.min(255, Math.max(0, 150 - (temperature - temperatureTarget)))},${Math.min(255, Math.max(0, 50 - (temperature - temperatureTarget)))}, 0.8) 0%, 
              rgba(50,50,50,0.3) 90%)`,
            boxShadow: `0 0 ${Math.min(40, Math.max(5, (temperature / temperatureTarget) * 20))}px 
                        rgba(255,${Math.min(255, 255 - (temperature - temperatureTarget) * 2)},0,0.7)`,
            transform: `scale(${Math.min(1.3, Math.max(0.7, 0.7 + ((gravity / gravityTarget) * 0.3)))})`,
          }}
        >
          <span className="text-white text-xs">
            {temperature > temperatureTarget * 0.5 && gravity > gravityTarget * 0.5 ? 
              "Star Core" : "Gas Cloud"}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center text-white">
              <label htmlFor="temperature" className="mr-2">Temperature</label>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded-md ml-1">
                {getTemperatureValue()} million K
              </span>
            </div>
            <span className={`${getTemperatureFeedbackColor()} font-semibold`}>
              {getFeedback(temperature, temperatureTarget)}
            </span>
          </div>
          
          <div className="relative h-2 bg-gray-700 rounded-lg overflow-hidden">
            {/* Optimal range indicator */}
            <div className="absolute h-full bg-green-500/30" 
                style={{ 
                  left: `${0.8 * temperatureTarget / 150 * 100}%`, 
                  width: `${0.4 * temperatureTarget / 150 * 100}%` 
                }} />
                
            {/* Slider track fill */}
            <div className={`absolute h-full transition-all ${getSliderTrackClass(temperature, temperatureTarget)}`}
                style={{ width: `${temperature / 150 * 100}%` }} />
          </div>
          
          <input
            id="temperature"
            type="range"
            min="0"
            max="150"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseInt(e.target.value))}
            className="w-full h-2 absolute opacity-0 cursor-pointer"
            style={{ marginTop: "-8px" }}
          />
          
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low</span>
            {/* Perfect range markers */}
            <span className="text-green-400">Perfect Zone</span>
            <span>High</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center text-white">
              <label htmlFor="gravity" className="mr-2">Gravity</label>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded-md ml-1">
                {getGravityValue()}x
              </span>
            </div>
            <span className={`${getGravityFeedbackColor()} font-semibold`}>
              {getFeedback(gravity, gravityTarget)}
            </span>
          </div>
          
          <div className="relative h-2 bg-gray-700 rounded-lg overflow-hidden">
            {/* Optimal range indicator */}
            <div className="absolute h-full bg-green-500/30" 
                style={{ 
                  left: `${0.8 * gravityTarget / 140 * 100}%`, 
                  width: `${0.4 * gravityTarget / 140 * 100}%` 
                }} />
                
            {/* Slider track fill */}
            <div className={`absolute h-full transition-all ${getSliderTrackClass(gravity, gravityTarget)}`}
                style={{ width: `${gravity / 140 * 100}%` }} />
          </div>
          
          <input
            id="gravity"
            type="range"
            min="0"
            max="140"
            value={gravity}
            onChange={(e) => onGravityChange(parseInt(e.target.value))}
            className="w-full h-2 absolute opacity-0 cursor-pointer"
            style={{ marginTop: "-8px" }}
          />
          
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low</span>
            {/* Perfect range markers */}
            <span className="text-green-400">Perfect Zone</span>
            <span>High</span>
          </div>
        </div>
      </div>
      
      <div className="text-white text-sm mt-4 space-y-1">
        <p className="text-center font-semibold">Balance temperature and gravity to form your star!</p>
        <p className="text-center text-amber-300 text-xs">
          (Keep both values in the "Perfect!" range for higher chance of success)
        </p>
        
        {/* Dynamic tips based on current values */}
        {temperature > temperatureTarget * 1.5 && (
          <p className="text-center text-red-400 text-xs animate-pulse mt-2">
            Warning: Extreme temperature may cause instability!
          </p>
        )}
        {gravity > gravityTarget * 1.5 && (
          <p className="text-center text-red-400 text-xs animate-pulse mt-2">
            Warning: Extreme gravity may cause collapse!
          </p>
        )}
        
        {/* Ignite button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onIgnite}
            className={`py-3 px-8 rounded-lg font-medium text-white transition-all
                      ${starPulse 
                        ? 'bg-green-600 hover:bg-green-700 animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-700'}`}
            disabled={!onIgnite}
          >
            {starPulse ? 'Ignite Star! ✨' : 'Attempt Ignition'}
          </button>
        </div>
      </div>
    </div>
  );
}