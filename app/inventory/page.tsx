"use client";

import React, { useState } from 'react';
import Header from '@/components/header';
import SwapAssets from '@/components/swapassets';

const InventoryPage = () => {
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  // Track which game icon is shown for each asset
  const [assetGameIcons, setAssetGameIcons] = useState(() => {
    // Initialize from localStorage if available, otherwise use default
    const savedIcons = typeof window !== 'undefined' ? localStorage.getItem('assetGameIcons') : null;
    return savedIcons ? JSON.parse(savedIcons) : {
      stickman: '/arcade/stick-man.png',
      poison: '/arcade/galaga.png',
      shield: '/arcade/galaga.png',
    };
  });

  // Called when swap is performed in SwapAssets
  const handleSwap = (selectedGame: { name: string; img: string } | null) => {
    if (!selectedGame) return;
    const newIcons = {
      ...assetGameIcons,
      stickman: selectedGame.img, // Use the selected game's image
    };
    setAssetGameIcons(newIcons);
    localStorage.setItem('assetGameIcons', JSON.stringify(newIcons));
    setIsSwapModalOpen(false); // Optionally close the modal after swap
  };

  return (
    <div className="min-h-screen bg-black arcade-pixel-font">

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white arcade-text-shadow animate-pulse arcade-pixel-font">Inventory</h1>
          <button 
            onClick={() => setIsSwapModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg arcade-border-glow transition-all arcade-pixel-font"
          >
            Swap Assets
          </button>
        </div>
        
        {/* Power Assets Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow arcade-pixel-font">Power</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow relative">
              <img src={assetGameIcons.stickman} alt="Stickman Game" className="absolute top-2 left-2 w-8 h-8" />
              <div className="flex flex-col items-center">
                <img 
                  src="/inventory/sigmastick.png" 
                  alt="stickman" 
                  className="w-20 h-20 mb-2 arcade-motion" 
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ name: 'stickman', img: '/inventory/sigmastick.png' }));
                  }}
                />
                <span className="text-purple-300 mb-2 arcade-pixel-font">Stickman boi</span>
                <span className="text-white arcade-pixel-font">2</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow relative">
              <img src="/arcade/galaga.png" alt="galaga Game" className="absolute top-2 left-2 w-8 h-8" />
              <div className="flex flex-col items-center">
                <img 
                  src="/inventory/poison.png" 
                  alt="Power Poison" 
                  className="w-20 h-20 mb-2 arcade-motion" 
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ name: 'Power Poison', img: '/inventory/poison.png' }));
                  }}
                />
                <span className="text-purple-300 mb-2 arcade-pixel-font">Power Poison</span>
                <span className="text-white arcade-pixel-font">3</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow relative">
              <img src="/arcade/stick-man.png" alt="Stickman Game" className="absolute top-2 left-2 w-8 h-8" />
              <div className="flex flex-col items-center">
                <img 
                  src="/inventory/sheild.png" 
                  alt="Power Shield" 
                  className="w-20 h-20 mb-2 arcade-motion" 
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ name: 'Power Shield', img: '/inventory/sheild.png' }));
                  }}
                />
                <span className="text-purple-300 mb-2 arcade-pixel-font">Power Shield</span>
                <span className="text-white arcade-pixel-font">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Themes Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow arcade-pixel-font">Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 mb-4 arcade-pixel-font">Sky Theme</span>
                <img src="/inventory/sky.png" alt="Sky Theme" className="w-32 h-32 rounded-lg object-cover mb-2" />
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 mb-4 arcade-pixel-font">Dark Theme</span>
                <img src="/inventory/night.png" alt="Dark Theme" className="w-32 h-32 rounded-lg object-cover mb-2" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SwapAssets
        open={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSwap={handleSwap}
      />
      <style jsx global>{`
        @font-face {
          font-family: 'Arcade';
          src: url('/fonts/pressstart2p-regular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        .arcade-pixel-font {
          font-family: 'Arcade', 'Press Start 2P', 'Courier New', monospace;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .font-arcade, .arcade-glow, .arcade-border-glow, .text-white, .text-purple-300, .font-mono, h1, h2, h3, h4, h5, h6, span, div, p, button, a {
          font-family: 'Arcade', 'Press Start 2P', 'Courier New', monospace !important;
        }
        
        .arcade-glow {
          text-shadow: 0 0 2px #fff, 0 0 4px #a78bfa, 0 0 6px #6366f1;
        }
        
        .arcade-text-shadow {
          text-shadow: 
            0 0 2px #fff, 
            0 0 5px rgba(138,43,226,0.8), 
            0 0 10px rgba(138,43,226,0.5);
          font-family: 'Arcade', 'Press Start 2P', monospace;
          letter-spacing: 2px;
        }
        
        .arcade-border-glow {
          box-shadow: 0 0 8px 2px #a78bfa99, 0 0 2px #6366f1;
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
        
        .arcade-motion {
          animation: arcade-bounce 1.8s infinite cubic-bezier(.68,-0.55,.27,1.55) alternate;
          will-change: transform;
        }
        
        @keyframes arcade-bounce {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default InventoryPage;
