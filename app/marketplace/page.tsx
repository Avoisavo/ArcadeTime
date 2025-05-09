"use client";

import React from 'react';
import Header from '@/components/header';

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header activeTab="Marketplace" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center arcade-glow uppercase tracking-widest" style={{fontFamily: 'Press Start 2P, monospace'}}>
          Marketplace
        </h1>

        {/* Rare Items Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow">Rare Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-purple-300">Rare Item 1</span>
                  <span className="text-yellow-400 text-sm">Limited Edition</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">100 SPACE</span>
                </div>
                <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Purchase
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-purple-300">Rare Item 2</span>
                  <span className="text-yellow-400 text-sm">Limited Edition</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">150 SPACE</span>
                </div>
                <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Unlimited Supply Items Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 arcade-glow">Unlimited Supply</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-purple-300">Common Item 1</span>
                  <span className="text-green-400 text-sm">Unlimited</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">50 SPACE</span>
                </div>
                <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Purchase
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-purple-500 arcade-border-glow">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-purple-300">Common Item 2</span>
                  <span className="text-green-400 text-sm">Unlimited</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-mono">75 SPACE</span>
                </div>
                <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Purchase
                </button>
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

export default MarketplacePage;
