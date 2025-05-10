"use client";

import React from 'react';
import Header from '@/components/header';

const InventoryPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header activeTab="Inventory" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center arcade-glow uppercase tracking-widest" style={{fontFamily: 'Press Start 2P, monospace'}}>
          Inventory
        </h1>
        
        {/* Power Assets Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow">Power</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <img src="/inventory/powershoes.png" alt="Power Shoes" className="w-20 h-20 mb-2" />
                <span className="text-purple-300 mb-2">Power Shoes</span>
                <span className="text-white font-mono">0</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 mb-2">Power Poison</span>
                <span className="text-white font-mono">0</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 mb-2">Power Shield</span>
                <span className="text-white font-mono">0</span>
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
                <div className="w-32 h-32 bg-blue-400 rounded-lg"></div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col items-center">
                <span className="text-purple-300 mb-4">Dark Theme</span>
                <div className="w-32 h-32 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        .arcade-glow {
          text-shadow: 0 0 2px #fff, 0 0 4px #a78bfa, 0 0 6px #6366f1;
        }
        .arcade-border-glow {
          box-shadow: 0 0 8px 2px #a78bfa99, 0 0 2px #6366f1;
        }
      `}</style>
    </div>
  );
};

export default InventoryPage;
