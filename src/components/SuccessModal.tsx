'use client';

import React, { useEffect } from 'react';

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
  useEffect(() => {
    // Add a slight delay for the confetti effect to make the appearance more impactful
    if (success) {
      const timer = setTimeout(() => {
        createConfetti();
      }, 500);
      
      return () => clearTimeout(timer);
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
  
  // Get star appearance component
  const StarVisual = () => {
    if (starType === 'failed') {
      return (
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* Animated failed star (cloud dispersing) */}
          <div className="absolute inset-0 bg-gray-700 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute inset-8 bg-red-900 rounded-full opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1/2 bg-gray-800/50 rounded-full animate-ping"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        {/* Animated star based on type */}
        <div className={`absolute inset-0 bg-gradient-radial ${getStarColor()} rounded-full animate-pulse`}></div>
        
        {starType === 'neutron_star' && (
          <div className="absolute inset-12 bg-white rounded-full animate-ping"></div>
        )}
        
        {starType === 'blue_giant' && (
          <div className="absolute -inset-3 bg-blue-300/20 rounded-full"></div>
        )}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className={`bg-gradient-to-br ${success ? 'from-indigo-900 to-black' : 'from-gray-900 to-black'} 
                      border ${success ? 'border-indigo-500' : 'border-red-900'} 
                      p-6 rounded-lg max-w-md w-full mx-4 text-center shadow-lg`}>
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
        
        <div className="py-6">
          <StarVisual />
          
          <p className="text-white text-lg mb-2">
            {success 
              ? `You have successfully created a ${starType.replace('_', ' ')}!` 
              : 'Your star was unstable and collapsed.'}
          </p>
          <p className="text-gray-300 text-sm mb-4">
            {starDescription || (success 
              ? 'You balanced the cosmic elements perfectly, allowing nuclear fusion to ignite.'
              : 'The extreme conditions prevented stable fusion from occurring.')}
          </p>
          
          {success && (
            <div className={`bg-black/30 p-3 rounded-lg inline-block mx-auto mb-4 ${
              starType === 'neutron_star' ? 'border border-purple-500' : ''
            }`}>
              <h4 className="text-yellow-200 text-lg">
                {starType === 'red_dwarf' && 'Eternal Flame Badge'}
                {starType === 'yellow_dwarf' && 'Star Creator Badge'}
                {starType === 'blue_giant' && 'Cosmic Titan Badge'}
                {starType === 'neutron_star' && 'Stellar Collapse Badge'}
              </h4>
              <p className="text-xs text-gray-300">
                {starType === 'red_dwarf' && 'Created the longest-living star type'}
                {starType === 'yellow_dwarf' && 'Created a perfect, balanced star'}
                {starType === 'blue_giant' && 'Created a massive stellar furnace'}
                {starType === 'neutron_star' && 'Pushed star formation to its limits'}
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={onRestart}
          className={`${success ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-700 hover:bg-red-800'} 
                     text-white py-2 px-6 rounded-full transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                       success ? 'focus:ring-indigo-400' : 'focus:ring-red-400'
                     }`}
        >
          {success ? 'Create Another Star' : 'Try Again'}
        </button>
      </div>
    </div>
  );
}