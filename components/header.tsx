"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import Swap from './swap';
import { getUserTokenBalances, TokenBalance } from '@/utils/tokenBalance';

// Dynamically import the WalletMultiButton with no SSR
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

interface HeaderProps {
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'Games' }) => {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);

  // Only show the wallet button after component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch token balances when wallet is connected
  useEffect(() => {
    const fetchBalances = async () => {
      if (publicKey) {
        const balances = await getUserTokenBalances(publicKey.toString());
        setTokenBalances(balances);
      }
    };

    fetchBalances();
    // Set up polling for balance updates
    const interval = setInterval(fetchBalances, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [publicKey]);

  const tabs = [
    { name: 'Games', path: '/games' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Marketplace', path: '/marketplace' }
  ];

  return (
    <header className="bg-black border-b border-purple-700/30 text-white p-4 flex justify-between items-center sticky top-0 z-50 arcade-header">
      {/* User Info Section */}
      <div className="flex items-center space-x-4">
        {connected && publicKey && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-xs font-bold">{publicKey.toString().slice(0, 2)}</span>
              </div>
              <span className="text-sm text-gray-300 font-mono">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </span>
            </div>
            <div className="flex space-x-3">
              {tokenBalances.map((token) => (
                <div key={token.symbol} className="bg-gray-900 px-3 py-1 rounded-full border border-purple-700/40">
                  <span className="text-xs text-purple-300">{token.symbol}</span>
                  <span className="text-sm font-mono ml-2">{token.balance}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
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

      {/* Wallet Button */}
      <div className="flex items-center">
        {mounted && <WalletMultiButton className="arcade-button" />}
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
