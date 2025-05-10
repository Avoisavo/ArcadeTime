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
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 overflow-hidden relative">
      {/* CRT screen overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none"></div>
      <div className="absolute inset-0 crt-overlay pointer-events-none"></div>
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,255,0.07)_1px,transparent_1px),linear-gradient(rgba(0,255,255,0.07)_1px,transparent_1px)] bg-[size:20px_20px] animate-grid-move"></div>
      
      {/* Neon border */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 border-4 border-neon-pink rounded-lg animate-neon-flicker"></div>
      
      {/* Corner arcade cabinet details */}
      <div className="absolute top-4 left-4 w-28 h-14 bg-black border-2 border-yellow-400 rounded flex items-center justify-center z-10">
        <p className="text-yellow-400 text-sm font-bold pixel-font rotate-[-5deg]">SOLANA</p>
      </div>
      
      <div className="absolute top-4 right-4 w-28 h-14 bg-black border-2 border-yellow-400 rounded flex items-center justify-center z-10">
        <p className="text-yellow-400 text-sm font-bold pixel-font rotate-[5deg]"> MEGA</p>
      </div>

      {/* Game characters */}
      <div className="absolute bottom-12 left-12 pixel-art animate-float z-10 hidden md:block">
        <Image 
          src="/arcade/pacman.png" 
          alt="Pac-Man" 
          width={60}
          height={60}
          className="object-contain pixelated"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      
      <div className="absolute top-24 right-12 pixel-art animate-float-alt z-10 hidden md:block">
        <Image 
          src="/arcade/space-invaders.png" 
          alt="Space Invader" 
          width={60}
          height={60}
          className="object-contain pixelated"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {/* Main content */}
      <main className={`flex flex-col items-center justify-center z-10 px-4 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Title screen */}
        <div className="text-center mb-10 pixel-font">
          <h1 className="text-6xl md:text-8xl font-bold text-neon-green arcade-title-flash mb-2">ARCADE</h1>
          <h1 className="text-5xl md:text-7xl font-bold text-neon-pink arcade-title-flash mb-10">TIME</h1>
          <p className="text-yellow-400 text-xl md:text-2xl uppercase tracking-widest mt-4 animate-pulse">© 1984 LAICORP</p>
        </div>
        
        <Link href="/library">
          <button className="bg-black border-2 border-neon-blue text-neon-blue pixel-font py-3 px-10 text-xl uppercase tracking-wider transform hover:scale-105 focus:outline-none hover:text-white hover:bg-neon-blue transition-all arcade-btn">
            PRESS START
          </button>
        </Link>
        
        {/* Game instructions */}
        <div className="mt-16 text-center">
          <p className="text-white pixel-font text-sm md:text-base animate-blink">
            PRESS SPACE TO START
          </p>
        </div>
        
        {/* Joystick and buttons */}
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex items-center space-x-4 z-10">
          <div className="w-12 h-12 rounded-full bg-black border-2 border-gray-700 relative">
            <div className="absolute inset-1 rounded-full bg-gray-800"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-8 bg-red-600 rounded-full"></div>
          </div>
          <div className="flex space-x-2">
            <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-red-800 shadow-glow-red"></div>
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-blue-800 shadow-glow-blue"></div>
          </div>
        </div>
      </main>
      
      {/* Styles */}
      <style jsx global>{`
        @font-face {
          font-family: 'PressStart2P';
          src: url('/fonts/PressStart2P-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        .pixel-font {
          font-family: 'PressStart2P', monospace;
          letter-spacing: 2px;
        }
        
        .text-neon-green {
          color: #0f6;
        }
        
        .text-neon-pink {
          color: #f0f;
        }
        
        .text-neon-blue {
          color: #0ff;
        }
        
        .border-neon-pink {
          border-color: #f0f;
        }
        
        .border-neon-blue {
          border-color: #0ff;
        }
        
        .bg-neon-blue {
          background-color: #0ff;
        }
        
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.3) 51%
          );
          background-size: 100% 4px;
          z-index: 20;
          pointer-events: none;
          opacity: 0.6;
        }
        
        .crt-overlay {
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(0, 0, 0, 0.2) 80%,
            rgba(0, 0, 0, 0.8) 100%
          );
          z-index: 21;
        }
        
        .pixelated {
          image-rendering: pixelated;
        }
        
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 0.95;
            box-shadow: 0 0 5px #f0f, 0 0 10px #f0f, 0 0 15px #f0f;
          }
          20%, 24%, 55% {
            opacity: 0.2;
            box-shadow: none;
          }
        }
        
        .animate-neon-flicker {
          animation: neon-flicker 10s infinite;
        }
        
        @keyframes arcade-title-flash {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
          }
          20%, 24%, 55% {
            text-shadow: none;
          }
        }
        
        .arcade-title-flash {
          animation: arcade-title-flash 5s infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-alt {
          animation: float 5s ease-in-out infinite reverse;
        }
        
        @keyframes grid-move {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(20px) translateX(-20px); }
        }
        
        .animate-grid-move {
          animation: grid-move 15s linear infinite;
        }
        
        @keyframes blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1.5s steps(1) infinite;
        }
        
        .shadow-glow-red {
          box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.5);
        }
        
        .shadow-glow-blue {
          box-shadow: 0 0 10px 2px rgba(0, 255, 255, 0.5);
        }
        
        .arcade-btn {
          position: relative;
          overflow: hidden;
        }
        
        .arcade-btn:after {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 20%;
          height: 200%;
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(30deg);
          transition: all 0.6s;
        }
        
        .arcade-btn:hover:after {
          left: 120%;
        }
      `}</style>
    </div>
  );
}
