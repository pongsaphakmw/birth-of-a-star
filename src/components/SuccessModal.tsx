'use client';
import React, { useEffect, useState } from 'react';

type StarType = 'red_dwarf' | 'yellow_dwarf' | 'blue_giant' | 'neutron_star' | 'failed';

type SuccessModalProps = {
  onRestart: () => void;
  success?: boolean;
  starType?: StarType;
  starDescription?: string;
};

export default function SuccessModal({ 
  onRestart, 
  success = true,
  starType = 'yellow_dwarf',
  starDescription = ''
}: SuccessModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Add a slight delay for the confetti effect to make the appearance more impactful
    if (success) {
      const timer = setTimeout(() => {
        createConfetti();
      }, 500);
      
      // Show details after a brief delay
      const detailsTimer = setTimeout(() => {
        setShowDetails(true);
      }, 1200);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(detailsTimer);
      };
    } else {
      // Show failure details immediately
      setShowDetails(true);
    }
  }, [success]);
  
  const createConfetti = () => {
    // Simple confetti effect using random elements
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'absolute';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '100';
    document.body.appendChild(confettiContainer);
    
    // Create confetti particles
    const colors = ['#FFD700', '#FF6347', '#00CED1', '#FF1493', '#ADFF2F', '#FFA500'];
    const particleCount = 150;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Random position, color, and rotation
      const leftPos = Math.random() * 100;
      const size = Math.random() * 8 + 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotation = Math.random() * 360;
      
      // Set particle style
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.left = `${leftPos}%`;
      particle.style.top = '-20px';
      particle.style.transform = `rotate(${rotation}deg)`;
      
      confettiContainer.appendChild(particle);
      
      // Animation
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 0.5;
      
      // Animate falling
      particle.animate([
        { top: '-20px', opacity: 1 },
        { top: '100vh', opacity: 0 }
      ], {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
      });
      
      // Remove after animation
      setTimeout(() => {
        if (confettiContainer.contains(particle)) {
          confettiContainer.removeChild(particle);
        }
        
        // Remove container if empty
        if (confettiContainer.childElementCount === 0) {
          document.body.removeChild(confettiContainer);
        }
      }, (duration + delay) * 1000);
    }
  };
  
  // Get star color based on type
  const getStarColor = () => {
    switch (starType) {
      case 'red_dwarf':
        return 'from-red-600 to-red-900';
      case 'yellow_dwarf':
        return 'from-yellow-300 to-yellow-600';
      case 'blue_giant':
        return 'from-blue-300 to-blue-600';
      case 'neutron_star':
        return 'from-purple-300 to-blue-600';
      case 'failed':
        return 'from-gray-500 to-red-900';
      default:
        return 'from-yellow-300 to-yellow-600';
    }
  };
  
  // Get star characteristics
  const getStarCharacteristics = () => {
    switch (starType) {
      case 'red_dwarf':
        return [
          { label: "Size", value: "Small", icon: "📏" },
          { label: "Temperature", value: "Low", icon: "🌡️" },
          { label: "Lifespan", value: "Trillions of years", icon: "⏳" },
          { label: "Mass", value: "8-50% of Sun", icon: "⚖️" }
        ];
      case 'yellow_dwarf':
        return [
          { label: "Size", value: "Medium", icon: "📏" },
          { label: "Temperature", value: "Medium", icon: "🌡️" },
          { label: "Lifespan", value: "10 billion years", icon: "⏳" },
          { label: "Mass", value: "Similar to Sun", icon: "⚖️" }
        ];
      case 'blue_giant':
        return [
          { label: "Size", value: "Very large", icon: "📏" },
          { label: "Temperature", value: "Very high", icon: "🌡️" },
          { label: "Lifespan", value: "10-100 million years", icon: "⏳" },
          { label: "Mass", value: "10-50x Sun", icon: "⚖️" }
        ];
      case 'neutron_star':
        return [
          { label: "Size", value: "Tiny (city-sized)", icon: "📏" },
          { label: "Density", value: "Extremely high", icon: "🧲" },
          { label: "Origin", value: "Collapsed massive star", icon: "💫" },
          { label: "Rotation", value: "Extremely fast", icon: "🔄" }
        ];
      case 'failed':
        return [
          { label: "Outcome", value: "Unstable cloud", icon: "☁️" },
          { label: "Issue", value: "Extreme conditions", icon: "⚠️" },
          { label: "Result", value: "Material dispersed", icon: "💨" },
          { label: "Next attempt", value: "Adjust parameters", icon: "🔄" }
        ];
      default:
        return [];
    }
  };
  
  // Get the star icon and animation
  const getStarIconClass = () => {
    switch (starType) {
      case 'red_dwarf':
        return 'text-red-500';
      case 'yellow_dwarf':
        return 'text-yellow-300';
      case 'blue_giant':
        return 'text-blue-300';
      case 'neutron_star':
        return 'text-purple-300';
      case 'failed':
        return 'text-gray-400';
      default:
        return 'text-yellow-300';
    }
  };
  
  // Get star appearance component
  const StarVisual = () => {
    if (starType === 'failed') {
      return (
        <div className="relative w-36 h-36 mx-auto mb-4">
          {/* Animated failed star (cloud dispersing) */}
          <div className="absolute inset-0 bg-gray-700 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute inset-8 bg-red-900/40 rounded-full"></div>
          
          {/* Particle dispersion animation */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 bg-gray-400 rounded-full animate-ping"
                style={{ 
                  left: `${50 + Math.cos(Math.PI * 2 * i / 8) * 40}%`,
                  top: `${50 + Math.sin(Math.PI * 2 * i / 8) * 40}%`,
                  opacity: 0.7,
                  animationDuration: `${1 + i * 0.2}s`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-800/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      );
    }
    
    // Special pulsar animation for neutron star
    if (starType === 'neutron_star') {
      return (
        <div className="relative w-36 h-36 mx-auto mb-4">
          {/* Core */}
          <div className={`absolute inset-10 bg-gradient-radial ${getStarColor()} rounded-full animate-pulse`}></div>
          
          {/* Pulsar beams */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1 bg-white/50 animate-pulse absolute rotate-45"></div>
            <div className="w-full h-1 bg-white/50 animate-pulse absolute -rotate-45"></div>
          </div>
          
          {/* Rotate animation */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500/30 animate-spin" 
              style={{ animationDuration: '10s' }}></div>
              
          {/* Magnetic field lines */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-blue-300 rounded-full"
                style={{ 
                  left: `${50 + Math.cos(Math.PI * 2 * i / 8) * 45}%`,
                  top: `${50 + Math.sin(Math.PI * 2 * i / 8) * 45}%`,
                  boxShadow: '0 0 8px 2px rgba(147, 197, 253, 0.5)'
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    }
    
    // Blue giant with corona
    if (starType === 'blue_giant') {
      return (
        <div className="relative w-36 h-36 mx-auto mb-4">
          {/* Outer corona */}
          <div className="absolute -inset-4 bg-blue-300/20 rounded-full animate-pulse"></div>
          
          {/* Main star body */}
          <div className={`absolute inset-0 bg-gradient-radial ${getStarColor()} rounded-full`}></div>
          
          {/* Surface features */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-4 h-4 bg-blue-200/40 rounded-full"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              ></div>
            ))}
          </div>
          
          {/* Solar flares */}
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-10 h-3 bg-blue-200/50 animate-pulse"
                style={{ 
                  left: `${50 + Math.cos(Math.PI * 2 * i / 3) * 45}%`,
                  top: `${50 + Math.sin(Math.PI * 2 * i / 3) * 45}%`,
                  transform: `translate(-50%, -50%) rotate(${i * 120}deg)`,
                  borderRadius: '40% 40% 20% 20%'
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    }
    
    // Red dwarf with convection cells
    if (starType === 'red_dwarf') {
      return (
        <div className="relative w-36 h-36 mx-auto mb-4">
          {/* Main star body */}
          <div className={`absolute inset-2 bg-gradient-radial ${getStarColor()} rounded-full`}></div>
          
          {/* Surface features */}
          <div className="absolute inset-2 overflow-hidden rounded-full">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 bg-red-800/70 rounded-full animate-pulse"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Warm glow */}
          <div className="absolute -inset-3 bg-red-900/10 rounded-full"></div>
        </div>
      );
    }
    
    // Yellow dwarf (like our Sun)
    return (
      <div className="relative w-36 h-36 mx-auto mb-4">
        {/* Outer corona */}
        <div className="absolute -inset-2 bg-yellow-200/20 rounded-full"></div>
        
        {/* Main star body */}
        <div className={`absolute inset-0 bg-gradient-radial ${getStarColor()} rounded-full animate-pulse`}
            style={{ animationDuration: '3s' }}></div>
        
        {/* Surface features */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-3 h-3 bg-yellow-600/50 rounded-full"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
          ))}
        </div>
        
        {/* Solar flares */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-6 h-2 bg-yellow-200/50"
              style={{ 
                left: `${50 + Math.cos(Math.PI * 2 * i / 4) * 45}%`,
                top: `${50 + Math.sin(Math.PI * 2 * i / 4) * 45}%`,
                transform: `translate(-50%, -50%) rotate(${i * 90}deg)`,
                borderRadius: '40% 40% 20% 20%'
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };
  
  // Get star fact based on type
  const getStarFact = () => {
    switch (starType) {
      case 'red_dwarf':
        return "Red dwarfs are the most common type of star in the Milky Way, making up 70% of all stars!";
      case 'yellow_dwarf':
        return "Our Sun is a yellow dwarf star that will continue to shine for another 5 billion years.";
      case 'blue_giant':
        return "Blue giants can be over 100,000 times more luminous than our Sun!";
      case 'neutron_star':
        return "A neutron star's density is so extreme that a teaspoon would weigh billions of tons!";
      case 'failed':
        return "Not all gas clouds successfully form stars - they need the right balance of forces.";
      default:
        return "";
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className={`bg-gradient-to-br ${success ? 'from-indigo-900 to-black' : 'from-gray-900 to-black'} 
                      border ${success ? 'border-indigo-500' : 'border-red-900'} 
                      p-6 rounded-lg max-w-md w-full mx-4 text-center shadow-lg
                      transition-all duration-500 ease-out
                      ${showDetails ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="mb-4">
          <h2 className={`text-3xl font-bold ${success ? 'text-yellow-300' : 'text-red-500'} mb-2`}>
            {success ? 'Congratulations!' : 'Formation Failed!'}
          </h2>
          <h3 className="text-xl text-white">
            {success 
              ? `Your ${starType.replace('_', ' ')} is Born!` 
              : 'The star collapsed during formation'}
          </h3>
        </div>
        
        <div className="py-4">
          <StarVisual />
          
          <p className="text-white text-lg mb-2">
            {success 
              ? `You have successfully created a ${starType.replace('_', ' ')}!` 
              : 'Your star was unstable and collapsed.'}
          </p>
          <p className="text-gray-300 text-sm mb-4">
            {starDescription || (success 
              ? 'You balanced the cosmic elements perfectly, allowing nuclear fusion to begin in the star core.'
              : 'The gravitational forces and energy weren\'t properly balanced, leading to collapse.')}
          </p>
          
          {/* Star characteristics */}
          <div className="my-6 grid grid-cols-2 gap-3 text-left">
            {getStarCharacteristics().map((item, index) => (
              <div key={index} className="flex items-center bg-black/30 p-2 rounded-lg">
                <span className="text-xl mr-2">{item.icon}</span>
                <div>
                  <h4 className="text-white text-sm font-medium">{item.label}</h4>
                  <p className="text-gray-300 text-xs">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Star fact */}
          <div className="mt-4 mb-6 bg-indigo-900/30 p-3 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <span className="text-lg mr-1">💫</span>
              <h4 className="text-white text-sm font-medium">Cosmic Fact:</h4>
            </div>
            <p className="text-gray-300 text-sm italic">{getStarFact()}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={onRestart}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors
                      ${success 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {success ? 'Create Another Star' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
}