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

// Help content for each stage
const HELP_CONTENT = {
  collection: {
    title: "Collection Stage Help",
    content: [
      "Move your cursor around the screen to attract hydrogen (H) and dust particles.",
      "Hydrogen is the main fuel for stars – you need to collect enough for fusion to begin.",
      "Dust contains heavier elements that help gravity pull the cloud together.",
      "The attraction field around your cursor will pull in nearby particles.",
      "Fill both progress bars to proceed to the next stage."
    ]
  },
  collapse: {
    title: "Gravitational Collapse Help",
    content: [
      "Use the sliders to adjust temperature and gravity to create your star.",
      "Temperature: Controls the heat energy in the core - too low and fusion won't start, too high and it becomes unstable.",
      "Gravity: Determines how much the cloud compresses - too low and the cloud dissipates, too high and it collapses completely.",
      "Watch the visual representation of your proto-star to see how your changes affect it.",
      "Find the 'Perfect!' balance for both values to successfully ignite fusion."
    ]
  },
  ignition: {
    title: "Ignition Stage Info",
    content: [
      "Success! The cloud has enough heat and pressure to begin nuclear fusion.",
      "The hydrogen atoms are fusing into helium, releasing massive amounts of energy.",
      "This energy is now balancing against the inward pull of gravity.",
      "Congratulations on creating a stable star!"
    ]
  }
};

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
  const [hint, setHint] = useState<string>('Move your cursor to attract particles');
  const [showHint, setShowHint] = useState<boolean>(true);
  const [firstCollection, setFirstCollection] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [collectionRate, setCollectionRate] = useState<{hydrogen: number, dust: number}>({hydrogen: 0, dust: 0});
  const [showProgressIndicator, setShowProgressIndicator] = useState<boolean>(false);
  const [lastResources, setLastResources] = useState<{hydrogen: number, dust: number}>({hydrogen: 0, dust: 0});
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  
  // Check for stage progression
  useEffect(() => {
    // Progress to gravity collapse stage
    if (stage === 'collection' && 
        resources.hydrogen >= HYDROGEN_TARGET && 
        resources.dust >= DUST_TARGET) {
      
      // Show transition animation
      setShowProgressIndicator(true);
      
      // Delay actual stage change to allow for animation
      setTimeout(() => {
        setStage('collapse');
        setShowHint(true); // Show hint for the next stage
        setHint('Adjust temperature and gravity, then click the ignite button when ready!');
        setShowProgressIndicator(false);
      }, 1500);
    }
    
    // Note: Removed the automatic ignition logic
    // Star formation now happens only through the manual ignition button
  }, [resources, stage]);
  
  // Track first collection to update hints
  useEffect(() => {
    if (!firstCollection && (resources.hydrogen > 0 || resources.dust > 0)) {
      setFirstCollection(true);
      setHint('Great! Keep collecting until the bars fill up');
      
      // Auto-hide this hint after 5 seconds
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [resources, firstCollection]);
  
  // Calculate collection rate for visual feedback
  useEffect(() => {
    const collectionInterval = setInterval(() => {
      if (stage === 'collection') {
        setCollectionRate({
          hydrogen: resources.hydrogen - lastResources.hydrogen,
          dust: resources.dust - lastResources.dust
        });
        
        setLastResources({
          hydrogen: resources.hydrogen,
          dust: resources.dust
        });
      }
    }, 1000);
    
    return () => clearInterval(collectionInterval);
  }, [resources, stage, lastResources]);
  
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
      
      // Show hint if temperature becomes dangerously high
      if (value > TEMPERATURE_TARGET * 1.5 && !showHint) {
        setHint('Warning: Temperature is getting dangerously high!');
        setShowHint(true);
      }
    }
  };

  const handleGravityChange = (value: number) => {
    if (stage === 'collapse') {
      setGravity(value);
      
      // Show hint if gravity becomes dangerously high
      if (value > GRAVITY_TARGET * 1.5 && !showHint) {
        setHint('Warning: Gravity is getting dangerously high!');
        setShowHint(true);
      }
    }
  };

  // Manual ignition handler
  const handleIgnition = () => {
    if (stage !== 'collapse') return;
    
    // Determine success or failure based on current values
    const tempRatio = temperature / TEMPERATURE_TARGET;
    const gravRatio = gravity / GRAVITY_TARGET;
    
    // Show transition animation
    setShowProgressIndicator(true);
    
    // Conditions that affect success chance
    let successChance = 0.85; // Base 85% success chance
    
    // Reduce success chance if values are not optimal
    if (tempRatio < 0.8 || tempRatio > 1.2) {
      successChance -= 0.3;
    }
    
    if (gravRatio < 0.8 || gravRatio > 1.2) {
      successChance -= 0.3;
    }
    
    // Critical failure condition - extremely high values
    if (tempRatio > 1.7 || gravRatio > 1.7) {
      successChance = 0.2; // Only 20% chance of success
    }
    
    // Determine outcome
    if (Math.random() < successChance) {
      // Success path
      determineStarType(temperature, gravity);
      
      setTimeout(() => {
        // Star successfully begins to form
        setStage('ignition');
        setHint('Fusion has begun! Watch as your star forms...');
        setShowHint(true);
        setShowProgressIndicator(false);
        
        setTimeout(() => {
          setShowHint(false);
          setTimeout(() => {
            setStage('complete');
            setShowSuccess(true);
          }, 4000); // 4-second animation before completion
        }, 3000);
      }, 1500);
    } else {
      // Failure path
      setTimeout(() => {
        setStage('failed');
        setStarType('failed');
        setShowProgressIndicator(false);
        
        setTimeout(() => {
          setShowSuccess(true); // Show failure modal
        }, 1500);
      }, 1500);
    }
  };

  const restartGame = () => {
    setStage('collection');
    setResources({ hydrogen: 0, dust: 0 });
    setLastResources({ hydrogen: 0, dust: 0 });
    setTemperature(0);
    setGravity(0);
    setShowSuccess(false);
    setStarType('yellow_dwarf');
    setFirstCollection(false);
    setHint('Move your cursor to attract particles');
    setShowHint(true);
    setShowHelp(false);
    setCollectionRate({ hydrogen: 0, dust: 0 });
  };

  // Get description for current star type
  const getStarTypeDescription = () => {
    switch (starType) {
      case 'red_dwarf':
        return "A small, relatively cool, low-mass star that can live for trillions of years.";
      case 'yellow_dwarf':
        return "A medium-sized star like our Sun with balanced temperature and gravity.";
      case 'blue_giant':
        return "A massive, hot, luminous star that will live fast and die spectacularly in a supernova explosion after only millions of years.";
      case 'neutron_star':
        return "An incredibly dense remnant of a massive star that has undergone gravitational collapse. It packs the mass of a star in a city-sized sphere.";
      default:
        return "A stable star formed through the perfect balance of gravity and fusion pressure.";
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === 'collection' && accessibilityMode) {
        // Arrow keys to collect particles
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
            e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          // Simulate particle collection in accessibility mode
          collectHydrogen(1);
          if (Math.random() < 0.5) collectDust(1);
          e.preventDefault();
        }
      } else if (stage === 'collapse' && accessibilityMode) {
        // Arrow keys to adjust temperature and gravity
        if (e.key === 'ArrowUp') {
          handleTemperatureChange(Math.min(temperature + 5, 150));
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          handleTemperatureChange(Math.max(temperature - 5, 0));
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          handleGravityChange(Math.min(gravity + 5, 140));
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          handleGravityChange(Math.max(gravity - 5, 0));
          e.preventDefault();
        } else if (e.key === 'Enter' || e.key === ' ') {
          // Add space and enter keys to trigger ignition in accessibility mode
          if (stage === 'collapse') {
            handleIgnition();
          }
          e.preventDefault();
        }
      }
      
      // Toggle help with H key
      if (e.key === 'h' || e.key === 'H') {
        setShowHelp(prev => !prev);
        e.preventDefault();
      }
      
      // Toggle accessibility mode with A key
      if (e.key === 'a' || e.key === 'A') {
        setAccessibilityMode(prev => !prev);
        if (!accessibilityMode) {
          setHint('Accessibility mode activated. Use arrow keys to interact.');
          setShowHint(true);
        }
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, temperature, gravity, accessibilityMode]);

  // Auto-hide hints after some time
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        // Don't auto-hide the initial hint until they start collecting
        if (firstCollection || stage !== 'collection') {
          setShowHint(false);
        }
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [showHint, firstCollection, stage]);
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background nebula */}
      <Nebula stage={stage} temperature={temperature} gravity={gravity} />
      
      {/* Collection stage */}
      {stage === 'collection' && (
        <div className="absolute inset-0 z-10">
          {/* Hydrogen particles */}
          <Particle 
            type="hydrogen"
            count={30}
            onCollect={collectHydrogen}
          />
          {/* Dust particles */}
          <Particle
            type="dust"
            count={20}
            onCollect={collectDust}
          />
        </div>
      )}
      
      {/* Progress indicators and controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        {stage === 'collection' && (
          <div className="flex flex-col space-y-2 mb-4">
            <ProgressBar 
              label="Hydrogen" 
              value={resources.hydrogen} 
              maxValue={HYDROGEN_TARGET} 
              color="blue"
              rate={collectionRate.hydrogen} 
            />
            <ProgressBar 
              label="Dust" 
              value={resources.dust} 
              maxValue={DUST_TARGET} 
              color="amber"
              rate={collectionRate.dust} 
            />
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
            onIgnite={handleIgnition}
          />
        )}
      </div>
      
      {/* Hints */}
      {showHint && (
        <div className="absolute top-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <div className="bg-indigo-900/80 text-white px-6 py-3 rounded-lg shadow-lg text-center max-w-md">
            {hint}
          </div>
        </div>
      )}
      
      {/* Accessibility mode indicator */}
      {accessibilityMode && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs z-30">
          Accessibility Mode
        </div>
      )}
      
      {/* Help button */}
      <button
        onClick={() => setShowHelp(prev => !prev)}
        className="absolute top-4 right-4 bg-indigo-700 hover:bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center z-30"
        aria-label="Help"
      >
        ?
      </button>
      
      {/* Help panel */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-indigo-900 text-white p-6 rounded-lg max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">{HELP_CONTENT[stage === 'complete' || stage === 'failed' ? 'ignition' : stage].title}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {HELP_CONTENT[stage === 'complete' || stage === 'failed' ? 'ignition' : stage].content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="mt-6 border-t border-indigo-700 pt-4">
              <p className="text-sm mb-2"><strong>Keyboard Controls:</strong></p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Press <strong>H</strong> to toggle this help panel</li>
                <li>Press <strong>A</strong> to toggle accessibility mode</li>
                {accessibilityMode && (
                  <>
                    <li>Use <strong>Arrow Keys</strong> to interact with the game</li>
                  </>
                )}
              </ul>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
            >
              Close Help
            </button>
          </div>
        </div>
      )}
      
      {/* Loading indicator between stages */}
      {showProgressIndicator && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white mt-4 text-lg">
              {stage === 'collection' 
                ? 'Gravitational collapse beginning...'
                : stage === 'collapse'
                  ? 'Ignition sequence initiating...'
                  : 'Finalizing star formation...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Success/failure modal */}
      {showSuccess && (
        <SuccessModal 
          onRestart={restartGame} 
          success={stage !== 'failed'} 
          starType={starType}
          starDescription={getStarTypeDescription()}
        />
      )}
    </div>
  );
}