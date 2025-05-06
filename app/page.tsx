"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-black animate-gradient-y"></div>
      
      {/* Moving grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,40,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,40,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 animate-grid-move"></div>
      
      {/* Animated subtle particles */}
      <div className="absolute inset-0 stars-container"></div>
      
      {/* Pulsing gradient border */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 border border-purple-600/30 rounded-xl animate-border-pulse"></div>
      
      {/* Radial overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-70 z-[1]"></div>
      
      {/* Corner decorations */}
      <div className="absolute top-6 left-6 opacity-70 z-10">
        <Image 
          src="/arcade/pacman.png" 
          alt="Pac-Man" 
          width={40}
          height={40}
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      
      <div className="absolute top-6 right-6 opacity-70 z-10">
        <Image 
          src="/arcade/space-invaders.png" 
          alt="Space Invader" 
          width={40}
          height={40}
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {/* Main content */}
      <main className={`flex flex-col items-center justify-center z-10 px-4 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-10">
          <h2 className="text-yellow-400 text-2xl md:text-3xl mb-3 welcome-glow uppercase tracking-widest font-bold">Welcome to</h2>
          <h1 className="text-6xl md:text-8xl font-bold text-white arcade-title-glow mb-12">Arcade Time</h1>
        </div>
        
        <Link href="/library">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-10 rounded-lg text-xl uppercase tracking-wider transition-all duration-300 transform hover:scale-105 focus:outline-none relative overflow-hidden group">
            <span className="relative z-10">START GAME</span>
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:from-yellow-500 group-hover:to-yellow-400 transition-all duration-700"></span>
            <span className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </Link>
        
        {/* Insert coin text */}
        <div className="absolute bottom-8 animate-blink">
          <p className="text-yellow-400 text-lg font-bold uppercase tracking-widest coin-glow">Insert Coin</p>
        </div>
        
        {/* Simple arcade buttons */}
        <div className="absolute bottom-8 right-8 flex space-x-3 z-10">
          <div className="w-8 h-8 rounded-full bg-yellow-500 shadow-sm"></div>
          <div className="w-8 h-8 rounded-full bg-blue-500 shadow-sm"></div>
          <div className="w-8 h-8 rounded-full bg-red-500 shadow-sm"></div>
        </div>
      </main>
      
      {/* Styles */}
      <style jsx global>{`
        .arcade-title-glow {
          text-shadow: 
            0 0 10px rgba(147, 51, 234, 0.7),
            0 0 20px rgba(147, 51, 234, 0.5),
            0 0 30px rgba(147, 51, 234, 0.3);
        }
        
        .welcome-glow {
          text-shadow: 0 0 10px rgba(250, 204, 21, 0.7);
        }
        
        .coin-glow {
          text-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
        
        @keyframes blink {
          0%, 80%, 100% { opacity: 1; }
          40% { opacity: 0.5; }
        }
        
        .animate-blink {
          animation: blink 2s infinite;
        }
        
        /* New animations */
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-y {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        @keyframes border-pulse {
          0%, 100% { border-color: rgba(147, 51, 234, 0.3); }
          50% { border-color: rgba(147, 51, 234, 0.1); }
        }
        
        .animate-border-pulse {
          animation: border-pulse 4s ease-in-out infinite;
        }
        
        /* Stars effect */
        .stars-container {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 50px 160px, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 90px 40px, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 160px 120px, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: stars-move 30s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes stars-move {
          0% { background-position: 0 0; }
          100% { background-position: 0 400px; }
        }
      `}</style>
    </div>
  );
}
