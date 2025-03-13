'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for the game component
// This ensures any browser-specific code only runs on the client
const StarGame = dynamic(() => import('./StarGame'), { 
  ssr: false 
});

export default function StarGameWrapper() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <StarGame />
    </div>
  );
}