'use client';

import { useState, useEffect, useRef } from 'react';

// Expanded particle types
type ParticleType = 'hydrogen' | 'dust';
type DustSubtype = 'iron' | 'silicate' | 'nickel' | 'carbon';

type ParticleProps = {
  type: ParticleType;
  count: number;
  onCollect: (amount: number) => void;
};

type ParticleData = {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  collected: boolean;
  particleType: ParticleType;
  dustSubtype?: DustSubtype; // Optional subtype for dust particles
};

// Counter for generating unique IDs
let particleIdCounter = 0;

// Determine particle color based on type and subtype
const getParticleColor = (particleType: ParticleType, dustSubtype?: DustSubtype) => {
  if (particleType === 'hydrogen') {
    return '#1E90FF'; // Bright blue for hydrogen
  }
  
  // Colors for different dust types
  switch (dustSubtype) {
    case 'iron':
      return '#CD853F'; // Sandy brown for iron
    case 'silicate':
      return '#E6E6FA'; // Lavender for silicate
    case 'nickel':
      return '#B0C4DE'; // Light steel blue for nickel
    case 'carbon':
      return '#696969'; // Dim gray for carbon
    default:
      return '#CD853F'; // Default dust color
  }
};

// Add a new component for collection animation
type CollectionAnimationProps = {
  x: number;
  y: number;
  type: ParticleType;
  dustSubtype?: DustSubtype;
};

const CollectionAnimation = ({ x, y, type, dustSubtype }: CollectionAnimationProps) => {
  return (
    <div
      className="absolute rounded-full animate-ping z-30"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: '30px',
        height: '30px',
        backgroundColor: getParticleColor(type, dustSubtype),
        opacity: 0,
        animation: 'ping 0.8s cubic-bezier(0, 0, 0.2, 1)'
      }}
    />
  );
};

export default function Particle({ type, count, onCollect }: ParticleProps) {
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [collectionAnimations, setCollectionAnimations] = useState<{id: number, x: number, y: number, type: ParticleType, dustSubtype?: DustSubtype}[]>([]);
  let animationIdCounter = 0;
  
  // Create a single particle with the given type
  const createParticle = (particleType: ParticleType) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Randomly choose one of the four edges to spawn from
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    
    let x, y;
    switch (edge) {
      case 0: // top
        x = Math.random() * width;
        y = -20;
        break;
      case 1: // right
        x = width + 20;
        y = Math.random() * height;
        break;
      case 2: // bottom
        x = Math.random() * width;
        y = height + 20;
        break;
      case 3: // left
      default:
        x = -20;
        y = Math.random() * height;
        break;
    }
    
    // Create base particle
    const particle: ParticleData = {
      id: particleIdCounter++,
      x,
      y,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      size: particleType === 'hydrogen' ? 
            Math.random() * 10 + 15 : 
            Math.random() * 12 + 18, // Increased dust size from (8+10) to (12+18)
      collected: false,
      particleType
    };
    
    // Add dust subtype if it's a dust particle
    if (particleType === 'dust') {
      // Random distribution of dust subtypes
      const dustTypes: DustSubtype[] = ['iron', 'silicate', 'nickel', 'carbon'];
      particle.dustSubtype = dustTypes[Math.floor(Math.random() * dustTypes.length)];
    }
    
    return particle;
  };
  
  // Setup initial particles
  useEffect(() => {
    const newParticles: ParticleData[] = [];
    if (!containerRef.current) return;
    
    // Create initial batch of particles
    for (let i = 0; i < count; i++) {
      const particleType = Math.random() < 0.7 ? 'hydrogen' : 'dust';
      newParticles.push(createParticle(particleType));
    }
    
    setParticles(newParticles);
    
    // Set up continuous particle generation with increased rate (500ms)
    const generateInterval = setInterval(() => {
      setParticles(prev => {
        // Don't let the number of particles grow too large
        if (prev.filter(p => !p.collected).length > count * 1.8) return prev;
        
        // Generate new particle with 70% chance of being hydrogen
        const particleType = Math.random() < 0.7 ? 'hydrogen' : 'dust';
        const newParticle = createParticle(particleType);
        
        return [...prev, newParticle];
      });
    }, 500); // Generate a new particle every 500ms (increased from 800ms)
    
    return () => clearInterval(generateInterval);
  }, [count]);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseEnter = () => {
      setIsMouseInCanvas(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseInCanvas(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Animation loop for particles
  useEffect(() => {
    const attractionRange = 150; // Range at which particles start being attracted
    const collectionRange = 30;  // Range at which particles are collected
    const attractionForce = 0.5; // How strong the attraction is
    let animationFrameId: number;
    const collectedParticles: {type: ParticleType, dustSubtype?: DustSubtype, amount: number}[] = [];
    let lastCollectionTime = 0;
    
    const animate = () => {
      const now = Date.now();
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setParticles(prev => {
        // Filter out particles that are way off-screen (cleanup)
        const filtered = prev.filter(p => {
          if (p.collected) return true; // Keep collected ones for respawning
          
          // Remove particles that are too far off-screen
          const buffer = 100;
          return !(p.x < -buffer || p.x > width + buffer || 
                   p.y < -buffer || p.y > height + buffer);
        });
        
        // Update remaining particles
        return filtered.map(particle => {
          if (particle.collected) return particle;
          
          // Calculate distance from mouse
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let newX = particle.x;
          let newY = particle.y;
          let newSpeedX = particle.speedX;
          let newSpeedY = particle.speedY;
          
          // Check if particle is within collection range and mouse is in canvas
          if (isMouseInCanvas && distance < collectionRange) {
            if (!particle.collected) {
              // Add collection animation
              setCollectionAnimations(prev => [
                ...prev, 
                {
                  id: animationIdCounter++,
                  x: particle.x,
                  y: particle.y,
                  type: particle.particleType,
                  dustSubtype: particle.dustSubtype
                }
              ]);
              
              // Play collection sound effect (if enabled)
              if (typeof window !== 'undefined') {
                try {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                  const oscillator = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();
                  
                  // Different pitches for different particle types
                  oscillator.frequency.value = particle.particleType === 'hydrogen' ? 440 : 330;
                  oscillator.type = 'sine';
                  
                  gainNode.gain.value = 0.1; // Low volume
                  oscillator.connect(gainNode);
                  gainNode.connect(audioContext.destination);
                  
                  oscillator.start();
                  oscillator.stop(audioContext.currentTime + 0.1);
                } catch (e) {
                  // Fail silently if audio context is not supported
                }
              }
              
              collectedParticles.push({
                type: particle.particleType,
                dustSubtype: particle.dustSubtype,
                amount: 1
              });
              return { ...particle, collected: true };
            }
          }
          
          // Apply attraction to mouse if within range and mouse is in canvas
          if (isMouseInCanvas && distance < attractionRange) {
            const force = (1 - distance / attractionRange) * attractionForce;
            newSpeedX += dx / distance * force;
            newSpeedY += dy / distance * force;
          }
          
          // Apply natural movement
          newSpeedX = newSpeedX * 0.98; // Damping
          newSpeedY = newSpeedY * 0.98; // Damping
          
          newX += newSpeedX;
          newY += newSpeedY;
          
          // Screen boundaries - wrap around only if close enough
          const wrapDistance = 50;
          if (newX < -wrapDistance || newX > width + wrapDistance || 
              newY < -wrapDistance || newY > height + wrapDistance) {
            // Let it continue moving off-screen - it will be cleaned up later
          } else {
            // Standard wrapping behavior for particles on screen
            if (newX < 0) newX = width;
            if (newX > width) newX = 0;
            if (newY < 0) newY = height;
            if (newY > height) newY = 0;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY
          };
        });
      });
      
      // Clean up old animations
      setCollectionAnimations(prev => 
        prev.filter(anim => now - anim.id < 800) // Remove animations after they complete
      );
      
      // Process collected particles in batches
      if (collectedParticles.length > 0 && now - lastCollectionTime > 200) {
        // Count hydrogen particles
        const hydrogenAmount = collectedParticles.filter(p => p.type === 'hydrogen')
          .reduce((sum, p) => sum + p.amount, 0);
        
        // Count dust particles
        const dustAmount = collectedParticles.filter(p => p.type === 'dust')
          .reduce((sum, p) => sum + p.amount, 0);
        
        // Send collection updates based on current component type
        if (type === 'hydrogen' && hydrogenAmount > 0) {
          onCollect(hydrogenAmount);
        } else if (type === 'dust' && dustAmount > 0) {
          onCollect(dustAmount);
        }
        
        // Clear collected particles
        collectedParticles.length = 0;
        lastCollectionTime = now;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, isMouseInCanvas, onCollect, type]);
  
  // Clean up old collected particles and spawn new ones
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setParticles(prev => {
        // Remove collected particles older than 5 seconds
        return prev.filter(p => !p.collected || p.id > particleIdCounter - 50);
      });
    }, 5000);
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Get particle label based on type and subtype
  const getParticleLabel = (particleType: ParticleType, dustSubtype?: DustSubtype) => {
    if (particleType === 'hydrogen') return 'H';
    
    switch (dustSubtype) {
      case 'iron':
        return 'Fe';
      case 'silicate':
        return 'Si';
      case 'nickel':
        return 'Ni';
      case 'carbon':
        return 'C';
      default:
        return 'Fe';
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none">
      {particles.map(particle => (
        !particle.collected && particle.particleType === type && (
          <div
            key={particle.id}
            className="absolute rounded-full flex items-center justify-center text-[8px] sm:text-[11px] text-white font-bold"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: getParticleColor(particle.particleType, particle.dustSubtype),
              opacity: 0.8,
              transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
              transform: `scale(${isMouseInCanvas ? 1 : 0.8})`
            }}
          >
            {getParticleLabel(particle.particleType, particle.dustSubtype)}
          </div>
        )
      ))}
      
      {/* Render collection animations */}
      {collectionAnimations.map(anim => (
        <CollectionAnimation 
          key={anim.id} 
          x={anim.x} 
          y={anim.y} 
          type={anim.type} 
          dustSubtype={anim.dustSubtype}
        />
      ))}
      
      {/* Visual indicator for particle attraction range */}
      {isMouseInCanvas && (
        <div
          className="absolute rounded-full border-2 border-white/20 pointer-events-none z-10"
          style={{
            left: `${mousePos.x - 150}px`, // 150 is the attraction range
            top: `${mousePos.y - 150}px`,
            width: '300px',
            height: '300px',
            opacity: 0.3,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </div>
  );
}