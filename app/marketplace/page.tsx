"use client";

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/header';

const MarketplacePage = () => {
  const { connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const items = [
    {
      id: 1,
      name: 'Rare Speed Boost',
      description: 'Temporary speed boost that lasts for 30 seconds',
      image: '/speed.png',
      price: 100,
      supply: 'Limited',
      rarity: 'Rare',
      type: 'Power'
    },
    {
      id: 2,
      name: 'Shield',
      description: 'Protects you from one hit',
      image: '/shield.png',
      price: 50,
      supply: 'Unlimited',
      rarity: 'Common',
      type: 'Power'
    }
  ];

  const handlePurchase = async (itemId: number) => {
    if (!connected) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement purchase logic here
      console.log(`Purchasing item ${itemId}`);
      // Add your purchase transaction logic here
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header activeTab="Marketplace" />
      
      <main className="container mx-auto px-4 py-8">
        {!connected ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Connect your wallet to access the marketplace</h2>
            <p className="text-gray-400">Browse and purchase items once connected</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Marketplace
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Item Image */}
                    <div className="w-full md:w-1/3">
                      <div className="aspect-square relative rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold">{item.name}</h3>
                          <p className="text-gray-400">{item.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.rarity === 'Rare' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.rarity}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="bg-gray-800 px-3 py-1 rounded-full">
                          Type: {item.type}
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded-full">
                          Supply: {item.supply}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <div className="text-2xl font-bold">
                          {item.price} <span className="text-sm text-gray-400">ARC</span>
                        </div>
                        <button
                          onClick={() => handlePurchase(item.id)}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Processing...' : 'Purchase'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .bg-gradient-to-r {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default MarketplacePage;
