"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Dynamically import the WalletMultiButton with no SSR
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

interface HeaderProps {
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Determine active tab based on current path
  const determineActiveTab = () => {
    if (pathname.includes('/library') || pathname.includes('/games')) return 'Games';
    if (pathname.includes('/inventory')) return 'Inventory';
    if (pathname.includes('/marketplace')) return 'Marketplace';
    if (pathname.includes('/swap')) return 'Swap';
    return activeTab || 'Games'; // Use provided activeTab or default to 'Games'
  };
  
  const currentActiveTab = determineActiveTab();

  // Only show the wallet button after component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { name: 'Games', path: '/library' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Marketplace', path: '/marketplace' }
  ];

  return (
    <header className="bg-black border-b border-purple-700/30 text-white p-4 flex justify-between items-center sticky top-0 z-50 arcade-header">
      {/* Empty div to maintain layout with justify-between */}
      <div className="w-[150px]"></div>

      {/* Navigation Tabs */}
      <div className="flex space-x-12 mx-auto relative">
        {tabs.map((tab) => (
          <Link 
            key={tab.name} 
            href={tab.path}
            className={`text-sm font-medium py-2 px-6 relative group overflow-hidden transition-all duration-300 ${
              currentActiveTab === tab.name 
                ? 'text-white arcade-text-glow' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {currentActiveTab === tab.name && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></span>
            )}
            <span className="relative z-10 uppercase tracking-wider font-bold arcade-pixel-font">{tab.name}</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"></span>
          </Link>
        ))}
        {/* Swap Button */}
        <Link
          href="/swap"
          className={`text-sm font-medium py-2 px-6 relative group overflow-hidden transition-all duration-300 ${
            currentActiveTab === 'Swap' 
              ? 'text-white arcade-text-glow' 
              : 'text-gray-400 hover:text-gray-200'
          } focus:outline-none`}
        >
          <span className="relative z-10 uppercase tracking-wider font-bold arcade-pixel-font">Swap</span>
          {currentActiveTab === 'Swap' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></span>
          )}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"></span>
        </Link>
      </div>

      {/* Wallet Button */}
      <div className="flex items-center">
        {mounted && <WalletMultiButton className="arcade-button" />}
      </div>

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

        .arcade-text-shadow {
          text-shadow: 
            0 0 2px #fff, 
            0 0 5px rgba(138,43,226,0.8), 
            0 0 10px rgba(138,43,226,0.5);
          font-family: 'Arcade', 'Press Start 2P', monospace;
          letter-spacing: 2px;
        }
        
        /* Add styling for wallet button to match the pixel font theme */
        .arcade-button {
          font-family: 'Arcade', 'Press Start 2P', 'Courier New', monospace !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase !important;
        }
      `}</style>
    </header>
  );
};

export default Header;
