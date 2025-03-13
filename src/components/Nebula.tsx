'use client';

import { useEffect, useRef } from 'react';

type NebulaProps = {
  stage: 'collection' | 'collapse' | 'ignition' | 'complete' | 'failed';
};

export default function Nebula({ stage }: NebulaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let stars: {x: number; y: number; size: number; opacity: number}[] = [];
    let animationFrameId: number;
    let angle = 0;
    
    // Create stars for background
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    
    // Nebula colors based on stage
    const getNebulaColors = () => {
      switch (stage) {
        case 'collection':
          return ['rgba(30, 20, 70, 0.4)', 'rgba(60, 10, 80, 0.3)'];
        case 'collapse':
          return ['rgba(70, 30, 60, 0.5)', 'rgba(90, 20, 40, 0.4)'];
        case 'ignition':
          return ['rgba(255, 100, 50, 0.5)', 'rgba(255, 80, 0, 0.4)'];
        case 'complete':
          return ['rgba(255, 200, 50, 0.6)', 'rgba(255, 150, 0, 0.5)'];
        case 'failed':
          return ['rgba(80, 10, 30, 0.3)', 'rgba(30, 10, 20, 0.2)'];
        default:
          return ['rgba(30, 20, 70, 0.4)', 'rgba(60, 10, 80, 0.3)'];
      }
    };
    
    // Main animation render function
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw black background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
      
      // Draw nebula clouds
      const colors = getNebulaColors();
      
      // Draw nebula clouds with gradient
      for (let i = 0; i < 3; i++) {
        const radius = 100 + i * 50;
        const gradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, radius * 2
        );
        
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        
        // Create cloud-like shapes
        for (let j = 0; j < 6; j++) {
          const offsetX = Math.cos(angle + j) * radius * 0.2;
          const offsetY = Math.sin(angle + j) * radius * 0.2;
          ctx.ellipse(
            canvas.width/2 + offsetX, 
            canvas.height/2 + offsetY, 
            radius + Math.sin(angle * 3 + j) * 20, 
            radius + Math.cos(angle * 2 + j) * 20, 
            angle / 5, 0, Math.PI * 2
          );
        }
        ctx.fill();
      }
      
      // Handle different stage visuals
      if (stage === 'failed') {
        // Draw dispersing particles for failed star
        const numParticles = 20;
        const disperseRadius = 150 + angle * 30;
        
        for (let i = 0; i < numParticles; i++) {
          const particleAngle = (i / numParticles) * Math.PI * 2;
          const x = canvas.width/2 + Math.cos(particleAngle) * disperseRadius * (0.5 + Math.random() * 0.5);
          const y = canvas.height/2 + Math.sin(particleAngle) * disperseRadius * (0.5 + Math.random() * 0.5);
          
          ctx.beginPath();
          ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 50, 50, ' + (0.8 - angle/20) + ')';
          ctx.fill();
        }
        
        // Unstable core
        const coreGradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, 40
        );
        coreGradient.addColorStop(0, 'rgba(100, 0, 0, 0.5)');
        coreGradient.addColorStop(0.5, 'rgba(50, 0, 0, 0.3)');
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = coreGradient;
        ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI * 2);
        ctx.fill();
      }
      // Draw glowing center for later stages
      else if (stage === 'collapse' || stage === 'ignition' || stage === 'complete') {
        const centerRadius = stage === 'complete' ? 100 : 
                             stage === 'ignition' ? 50 : 20;
        
        const centerGradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, centerRadius * 2
        );
        
        const coreColor = stage === 'complete' ? 'rgba(255, 220, 50, 0.8)' :
                          stage === 'ignition' ? 'rgba(255, 150, 0, 0.7)' :
                          'rgba(255, 100, 0, 0.5)';
        
        centerGradient.addColorStop(0, coreColor);
        centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = centerGradient;
        ctx.arc(canvas.width/2, canvas.height/2, centerRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Swirling effect for collapse and ignition stages
      if (stage === 'collapse' || stage === 'ignition') {
        const numParticles = 30;
        const orbitRadius = 150;
        
        for (let i = 0; i < numParticles; i++) {
          const particleAngle = (i / numParticles) * Math.PI * 2 + angle;
          const distFromCenter = Math.max(10, orbitRadius - (stage === 'ignition' ? angle * 10 : 0));
          
          const x = canvas.width/2 + Math.cos(particleAngle) * distFromCenter;
          const y = canvas.height/2 + Math.sin(particleAngle) * distFromCenter;
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? 'rgba(100, 150, 255, 0.8)' : 'rgba(255, 200, 100, 0.8)';
          ctx.fill();
          
          // Particle trail
          const trailLength = 5;
          for (let j = 1; j <= trailLength; j++) {
            const trailAngle = particleAngle - (j * 0.1);
            const tx = canvas.width/2 + Math.cos(trailAngle) * distFromCenter;
            const ty = canvas.height/2 + Math.sin(trailAngle) * distFromCenter;
            
            ctx.beginPath();
            ctx.arc(tx, ty, 3 * (1 - j/trailLength), 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 
              ? `rgba(100, 150, 255, ${0.8 * (1 - j/trailLength)})` 
              : `rgba(255, 200, 100, ${0.8 * (1 - j/trailLength)})`;
            ctx.fill();
          }
        }
      }
      
      // Animate the star burst if in ignition stage
      if (stage === 'ignition') {
        const burstGradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, 200 + angle * 20
        );
        
        burstGradient.addColorStop(0, 'rgba(255, 255, 100, 0.7)');
        burstGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.3)');
        burstGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = burstGradient;
        ctx.arc(canvas.width/2, canvas.height/2, 200 + angle * 20, 0, Math.PI * 2);
        ctx.fill();
      }
      
      angle += stage === 'ignition' ? 0.02 : 
               stage === 'failed' ? 0.05 : 0.005;
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    // Clean up animation when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stage]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ backgroundColor: 'black' }}
    />
  );
}