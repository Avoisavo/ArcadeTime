"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Animated flickering text component for arcade aesthetic
const FlickeringText = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <h1 className="text-6xl md:text-8xl font-bold text-center text-white arcade-text-shadow animate-flicker">
        {children}
      </h1>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg opacity-50 arcade-glow"></div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden relative">
      {/* Arcade-style background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:30px_30px] [background-position:center] scale-[3] opacity-30 z-0"></div>
      
      {/* Animated noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>
      
      {/* Main content */}
      <main className="flex flex-col items-center justify-center gap-16 z-10 px-4">
        <FlickeringText>Arcade Time</FlickeringText>
        
        <Link href="/library" className="group">
          <button className="px-16 py-4 text-xl bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold uppercase tracking-wider hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(138,43,226,0.8)] hover:shadow-[0_0_25px_rgba(138,43,226,1)] focus:outline-none group relative overflow-hidden">
            <span className="relative z-10">Start Game</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </button>
        </Link>
        
        {/* Decorative pixel art elements */}
        <div className="absolute bottom-10 left-10 hidden md:block opacity-70">
          <Image 
            src="/arcade/pacman.png" 
            alt="Pac-Man" 
            width={60} 
            height={60} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        <div className="absolute top-10 right-10 hidden md:block opacity-70">
          <Image 
            src="/arcade/space-invaders.png" 
            alt="Space Invader" 
            width={60} 
            height={60}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </main>
      
      {/* Add custom styles for arcade aesthetics */}
      <style jsx global>{`
        .arcade-text-shadow {
          text-shadow: 
            0 0 5px #fff, 
            0 0 10px #fff, 
            0 0 15px #8a2be2, 
            0 0 20px #8a2be2, 
            0 0 25px #8a2be2, 
            0 0 30px #8a2be2, 
            0 0 35px #8a2be2;
        }
        
        .arcade-glow {
          filter: blur(8px);
          animation: glow 2s infinite alternate;
        }
        
        @keyframes glow {
          from {
            opacity: 0.3;
          }
          to {
            opacity: 0.6;
          }
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 0.99;
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
          }
        }
        
        .animate-flicker {
          animation: flicker 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
