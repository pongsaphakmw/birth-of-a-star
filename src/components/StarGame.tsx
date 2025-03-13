'use client';

import { useEffect, useState, useRef } from 'react';
import Nebula from './Nebula';
import Particle from './Particle';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import SuccessModal from './SuccessModal';

// Game state types
type GameStage = 'collection' | 'collapse' | 'ignition' | 'complete' | 'failed';

// Star types based on temperature and gravity values
type StarType = 'red_dwarf' | 'yellow_dwarf' | 'blue_giant' | 'neutron_star' | 'failed';

// Game constants
const HYDROGEN_TARGET = 100;
const DUST_TARGET = 50;
const TEMPERATURE_TARGET = 80;
const GRAVITY_TARGET = 70;

export default function StarGame() {
  // Game state
  const [stage, setStage] = useState<GameStage>('collection');
  const [resources, setResources] = useState({
    hydrogen: 0,
    dust: 0,
  });
  const [temperature, setTemperature] = useState(0);
  const [gravity, setGravity] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [starType, setStarType] = useState<StarType>('yellow_dwarf');
  
  // Check for stage progression and determine star type outcome
  useEffect(() => {
    // Progress to gravity collapse stage
    if (stage === 'collection' && 
        resources.hydrogen >= HYDROGEN_TARGET && 
        resources.dust >= DUST_TARGET) {
      setStage('collapse');
    }
    
    // Progress to ignition stage or fail based on temperature and gravity
    if (stage === 'collapse') {
      const tempRatio = temperature / TEMPERATURE_TARGET;
      const gravRatio = gravity / GRAVITY_TARGET;
      
      // Check if both values are in extreme ranges (too high)
      if (tempRatio > 1.7 || gravRatio > 1.7) {
        // 80% chance of failure if values are extremely high
        if (Math.random() < 0.8) {
          setStage('failed');
          setStarType('failed');
          setTimeout(() => {
            setShowSuccess(true); // Reusing success modal but with failure message
          }, 2000);
          return;
        }
      }
      
      // Continue with star formation if within acceptable ranges
      if (temperature >= TEMPERATURE_TARGET * 0.9 && 
          gravity >= GRAVITY_TARGET * 0.9) {
        
        // Determine star type based on temperature and gravity values
        determineStarType(temperature, gravity);
        
        // Star successfully begins to form
        setStage('ignition');
        setTimeout(() => {
          setStage('complete');
          setShowSuccess(true);
        }, 5000); // 5-second animation before completion
      }
    }
  }, [resources, temperature, gravity, stage]);
  
  // Determine the type of star created based on temperature and gravity ratios
  const determineStarType = (temp: number, grav: number) => {
    const tempRatio = temp / TEMPERATURE_TARGET;
    const gravRatio = grav / GRAVITY_TARGET;
    
    // Red Dwarf: Low temperature, moderate-to-high gravity
    if (tempRatio < 1.1 && gravRatio >= 1.0) {
      setStarType('red_dwarf');
      return;
    }
    
    // Blue Giant: High temperature, low-to-moderate gravity
    if (tempRatio >= 1.3 && gravRatio < 1.2) {
      setStarType('blue_giant');
      return;
    }
    
    // Neutron Star: High temperature, high gravity
    if (tempRatio >= 1.3 && gravRatio >= 1.3) {
      setStarType('neutron_star');
      return;
    }
    
    // Default - Yellow Dwarf (like our Sun): Balanced temperature and gravity
    setStarType('yellow_dwarf');
  };

  // Resource collection handlers
  const collectHydrogen = (amount: number) => {
    if (stage === 'collection') {
      setResources(prev => ({
        ...prev,
        hydrogen: Math.min(prev.hydrogen + amount, HYDROGEN_TARGET * 1.2)
      }));
    }
  };

  const collectDust = (amount: number) => {
    if (stage === 'collection') {
      setResources(prev => ({
        ...prev, 
        dust: Math.min(prev.dust + amount, DUST_TARGET * 1.2)
      }));
    }
  };

  // Control handlers
  const handleTemperatureChange = (value: number) => {
    if (stage === 'collapse') {
      setTemperature(value);
    }
  };

  const handleGravityChange = (value: number) => {
    if (stage === 'collapse') {
      setGravity(value);
    }
  };

  const restartGame = () => {
    setStage('collection');
    setResources({ hydrogen: 0, dust: 0 });
    setTemperature(0);
    setGravity(0);
    setShowSuccess(false);
    setStarType('yellow_dwarf');
  };

  // Get description for current star type
  const getStarTypeDescription = () => {
    switch (starType) {
      case 'red_dwarf':
        return "A small, relatively cool, low-mass star that can live for trillions of years.";
      case 'yellow_dwarf':
        return "A medium-sized star like our Sun with balanced temperature and gravity.";
      case 'blue_giant':
        return "A massive, hot, luminous star that will live fast and die spectacularly.";
      case 'neutron_star':
        return "An incredibly dense remnant of a massive star that collapsed under gravity.";
      case 'failed':
        return "The star formation process became unstable and collapsed.";
      default:
        return "";
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background nebula */}
      <Nebula stage={stage === 'failed' ? 'collection' : stage} />

      {/* Game stage display */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg z-10">
        {stage === 'collection' && "Stage 1: Cosmic Cloud Formation"}
        {stage === 'collapse' && "Stage 2: Gravitational Collapse"}
        {stage === 'ignition' && "Stage 3: Protostar Ignition"}
        {stage === 'complete' && `Star Formation Complete: ${starType.replace('_', ' ').toUpperCase()}`}
        {stage === 'failed' && "Star Formation Failed!"}
      </div>

      {/* Resource particles - only visible during collection stage */}
      {stage === 'collection' && (
        <>
          <Particle 
            type="hydrogen" 
            count={15} 
            onCollect={collectHydrogen} 
          />
          <Particle 
            type="dust" 
            count={10} 
            onCollect={collectDust} 
          />
        </>
      )}

      {/* Progress tracking UI */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 p-4 rounded-lg z-10">
        {stage === 'collection' && (
          <div className="space-y-2">
            <ProgressBar 
              label="Hydrogen" 
              current={resources.hydrogen} 
              max={HYDROGEN_TARGET} 
              color="blue" 
            />
            <ProgressBar 
              label="Dust" 
              current={resources.dust} 
              max={DUST_TARGET} 
              color="amber" 
            />
            <p className="text-white text-sm mt-1">
              Move around to collect particles!
            </p>
          </div>
        )}

        {stage === 'collapse' && (
          <Controls 
            temperature={temperature}
            gravity={gravity}
            onTemperatureChange={handleTemperatureChange}
            onGravityChange={handleGravityChange}
            temperatureTarget={TEMPERATURE_TARGET}
            gravityTarget={GRAVITY_TARGET}
          />
        )}

        {(stage === 'ignition' || stage === 'complete') && (
          <div className="text-center text-white">
            {stage === 'ignition' ? 
              "Fusion is beginning! Star is forming..." : 
              "Congratulations! You've created a star!"}
          </div>
        )}
        
        {stage === 'failed' && (
          <div className="text-center text-red-400">
            <p className="text-lg">The formation process has become unstable!</p>
            <p className="text-sm mt-1">Too extreme temperature or gravity caused the process to fail.</p>
          </div>
        )}
      </div>

      {/* Warning flash for dangerous values */}
      {stage === 'collapse' && (temperature > TEMPERATURE_TARGET * 1.5 || gravity > GRAVITY_TARGET * 1.5) && (
        <div className={`absolute inset-0 bg-red-500/20 pointer-events-none z-10 ${
          temperature > TEMPERATURE_TARGET * 1.7 || gravity > GRAVITY_TARGET * 1.7 ? 'animate-pulse' : ''
        }`} />
      )}

      {/* Success or failure modal */}
      {showSuccess && (
        <SuccessModal 
          onRestart={restartGame} 
          success={starType !== 'failed'}
          starType={starType}
          starDescription={getStarTypeDescription()}
        />
      )}
    </div>
  );
}