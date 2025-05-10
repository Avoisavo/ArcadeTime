"use client";

import React from 'react';
import Header from '@/components/header';

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-arcade arcade-bg">
      <Header activeTab="Marketplace" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white arcade-text-shadow animate-pulse">Marketplace</h1>

        {/* Rare Items Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow">Rare Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow arcade-card-glow flex flex-col items-center justify-between min-h-[260px] transition-transform hover:scale-105">
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 w-full">
                  <span className="text-purple-300 arcade-glow text-lg mb-1">Cosmic Shield</span>
                  <span className="text-yellow-400 text-xs arcade-glow">Limited Edition</span>
                </div>
                <div className="flex flex-col items-center w-full mb-2">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">100 SPACE</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors arcade-btn arcade-glow">
                Purchase
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow arcade-card-glow flex flex-col items-center justify-between min-h-[260px] transition-transform hover:scale-105">
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 w-full">
                  <span className="text-purple-300 arcade-glow text-lg mb-1">Nova Blaster</span>
                  <span className="text-yellow-400 text-xs arcade-glow">Limited Edition</span>
                </div>
                <div className="flex flex-col items-center w-full mb-2">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">150 SPACE</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors arcade-btn arcade-glow">
                Purchase
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow arcade-card-glow flex flex-col items-center justify-between min-h-[260px] transition-transform hover:scale-105">
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 w-full">
                  <span className="text-purple-300 arcade-glow text-lg mb-1">Quantum Core</span>
                  <span className="text-yellow-400 text-xs arcade-glow">Limited Edition</span>
                </div>
                <div className="flex flex-col items-center w-full mb-2">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">200 SPACE</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors arcade-btn arcade-glow">
                Purchase
              </button>
            </div>
          </div>
        </div>

        {/* Unlimited Supply Items Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow">Unlimited Supply</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow arcade-card-glow flex flex-col items-center justify-between min-h-[260px] transition-transform hover:scale-105">
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 w-full">
                  <span className="text-purple-300 arcade-glow text-lg mb-1">Energy Cell</span>
                  <span className="text-green-400 text-xs arcade-glow">Unlimited</span>
                </div>
                <div className="flex flex-col items-center w-full mb-2">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">50 SPACE</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors arcade-btn arcade-glow">
                Purchase
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow arcade-card-glow flex flex-col items-center justify-between min-h-[260px] transition-transform hover:scale-105">
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 w-full">
                  <span className="text-purple-300 arcade-glow text-lg mb-1">Star Fragment</span>
                  <span className="text-green-400 text-xs arcade-glow">Unlimited</span>
                </div>
                <div className="flex flex-col items-center w-full mb-2">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">75 SPACE</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors arcade-btn arcade-glow">
                Purchase
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow arcade-card-glow flex flex-col items-center justify-between min-h-[260px] transition-transform hover:scale-105">
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 w-full">
                  <span className="text-purple-300 arcade-glow text-lg mb-1">Space Crystal</span>
                  <span className="text-green-400 text-xs arcade-glow">Unlimited</span>
                </div>
                <div className="flex flex-col items-center w-full mb-2">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">100 SPACE</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors arcade-btn arcade-glow">
                Purchase
              </button>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        @font-face {
          font-family: 'Press Start 2P';
          src: url('/fonts/PressStart2P-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        .font-arcade, .arcade-glow, .arcade-border-glow, .text-white, .text-purple-300, .font-mono, h1, h2, h3, h4, h5, h6, span, div, p, button, a {
          font-family: 'Press Start 2P', monospace !important;
        }
        .arcade-glow {
          text-shadow: 0 0 2px #fff, 0 0 4px #a78bfa, 0 0 6px #6366f1;
        }
        .arcade-border-glow {
          box-shadow: 0 0 8px 2px #a78bfa99, 0 0 2px #6366f1;
        }
        .arcade-text-shadow {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.8), 0 0 10px rgba(138,43,226,0.5);
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 2px;
        }
        .bg-gray-900 {
          background: linear-gradient(135deg, #232136 60%, #3b0764 100%);
        }
        .border-purple-500 {
          border-color: #a78bfa;
        }
        .rounded-xl {
          border-radius: 1.25rem;
        }
        .container {
          max-width: 900px;
        }
        .w-20, .h-20, .w-32, .h-32 {
          image-rendering: pixelated;
        }
        .text-white, .text-purple-300 {
          letter-spacing: 1px;
        }
        button, a {
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .arcade-bg {
          background-image: 
            linear-gradient(to bottom, rgba(25,25,25,1) 0%, rgba(10,10,10,1) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: multiply;
        }
        .arcade-card-glow:hover {
          box-shadow: 0 0 15px rgba(138,43,226,0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .arcade-btn {
          position: relative;
          overflow: hidden;
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 1px;
        }
        .arcade-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255,255,255,0.1) 50%,
            transparent 100%
          );
          transform: rotate(45deg);
          animation: button-shine 3s linear infinite;
        }
        @keyframes button-shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }
        .arcade-bg::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
          pointer-events: none;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default MarketplacePage;
