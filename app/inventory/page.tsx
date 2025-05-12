"use client";

import React, { useState } from 'react';
import Header from '@/components/header';
import SwapAssets from '@/components/swapassets';

const InventoryPage = () => {
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black font-arcade">
      <Header activeTab="Inventory" />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white arcade-text-shadow animate-pulse">Inventory</h1>
          <button 
            onClick={() => setIsSwapModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg arcade-border-glow transition-all"
          >
            Swap Assets
          </button>
        </div>
        
        {/* Power Assets Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow">Power</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <img 
                  src="/inventory/stickman.png" 
                  alt="stickman" 
                  className="w-20 h-20 mb-2 arcade-motion" 
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/json', JSON.stringify({ name: 'stickman', img: '/inventory/stickman.png' }));
                  }}
                />
                <span className="text-purple-300 mb-2">Stickman boi</span>
                <span className="text-white font-mono">2</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
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
                <span className="text-purple-300 mb-2">Power Poison</span>
                <span className="text-white font-mono">3</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
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
                <span className="text-purple-300 mb-2">Power Shield</span>
                <span className="text-white font-mono">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Themes Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow">Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 mb-4">Sky Theme</span>
                <img src="/inventory/sky.png" alt="Sky Theme" className="w-32 h-32 rounded-lg object-cover mb-2" />
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 mb-4">Dark Theme</span>
                <img src="/inventory/night.png" alt="Dark Theme" className="w-32 h-32 rounded-lg object-cover mb-2" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SwapAssets open={isSwapModalOpen} onClose={() => setIsSwapModalOpen(false)} />
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
