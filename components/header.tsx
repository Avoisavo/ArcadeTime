"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import Swap from './swap';

// Dynamically import the WalletMultiButton with no SSR
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

interface HeaderProps {
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'Games' }) => {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  // Only show the wallet button after component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { name: 'Games', path: '/games' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Shop', path: '/shop' }
  ];

  return (
    <header className="bg-black border-b border-purple-700/30 text-white p-4 flex justify-between items-center sticky top-0 z-50 arcade-header">
      <div className="flex space-x-12 mx-auto relative">
        {tabs.map((tab) => (
          <Link 
            key={tab.name} 
            href={tab.path}
            className={`text-sm font-medium py-2 px-6 relative group overflow-hidden transition-all duration-300 ${
              activeTab === tab.name 
                ? 'text-white arcade-text-glow' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {activeTab === tab.name && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></span>
            )}
            <span className="relative z-10 uppercase tracking-wider font-bold">{tab.name}</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"></span>
          </Link>
        ))}
        {/* Swap Button */}
        <button
          onClick={() => setSwapOpen(true)}
          className="text-sm font-medium py-2 px-6 relative group overflow-hidden transition-all duration-300 text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          <span className="relative z-10 uppercase tracking-wider font-bold">Swap</span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"></span>
        </button>
      </div>
      <div className="absolute right-8">
        {mounted && (
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-blue-600 hover:!to-purple-600 !text-white !py-2 !px-6 !rounded-md !text-sm !uppercase !font-bold !tracking-wider transform hover:!scale-105 transition-all duration-300 !shadow-[0_0_10px_rgba(138,43,226,0.5)] hover:!shadow-[0_0_15px_rgba(138,43,226,0.8)]" />
        )}
      </div>

      {/* Swap Modal */}
      {swapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-8 relative w-full max-w-md mx-auto">
            <button
              onClick={() => setSwapOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <Swap />
          </div>
        </div>
      )}

      <style jsx global>{`
        .arcade-header {
          background-image: 
            linear-gradient(to right, rgba(15,15,15,1) 0%, rgba(5,5,5,1) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: multiply;
          box-shadow: 0 0 20px rgba(0,0,0,0.7);
        }
        
        .arcade-text-glow {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.8);
        }
      `}</style>
    </header>
  );
};

export default Header;
