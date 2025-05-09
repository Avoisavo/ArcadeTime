"use client";

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/header';

const InventoryPage = () => {
  const { connected } = useWallet();

  // Mock data - replace with actual data from your backend
  const backgrounds = [
    { id: 1, name: 'Space', image: '/space-bg.png' },
    { id: 2, name: 'Stickman', image: '/stick-man.png' },
    // Add more backgrounds as needed
  ];

  const powers = [
    { id: 1, name: 'Speed Boost', image: '/speed.png' },
    { id: 2, name: 'Double Jump', image: '/double-jump.png' },
    { id: 3, name: 'Shield', image: '/shield.png' },
    // Add more powers as needed
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header activeTab="Inventory" />
      
      <main className="container mx-auto px-4 py-8">
        {!connected ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Connect your wallet to view your inventory</h2>
            <p className="text-gray-400">Your assets will appear here once connected</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Backgrounds Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Backgrounds
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
                      <img
                        src={bg.image}
                        alt={bg.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center">{bg.name}</h3>
                  </div>
                ))}
              </div>
            </section>

            {/* Powers Section */}
            <section>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Powers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {powers.map((power) => (
                  <div
                    key={power.id}
                    className="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
                      <img
                        src={power.image}
                        alt={power.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center">{power.name}</h3>
                  </div>
                ))}
              </div>
            </section>
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

export default InventoryPage;
