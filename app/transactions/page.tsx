"use client";

import React from 'react';
import Header from '@/components/header';
import Navbar from '@/components/navbar';

export default function TransactionPage() {
  const handleTransactionClick = (signature: string) => {
    window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header activeTab="Transactions" />
      <div className="flex">
        <Navbar activePage="transactions" />
        <main className="ml-64 p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white arcade-text-glow">Transaction History</h1>
            
            {/* Transaction List */}
            <div className="bg-black/50 border border-purple-700/30 rounded-lg p-6 shadow-[0_0_20px_rgba(138,43,226,0.2)]">
              <div className="space-y-4">
                {/* Transaction Item */}
                <div 
                  onClick={() => handleTransactionClick('4x8h9k2m')}
                  className="p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg border border-purple-700/30 hover:shadow-[0_0_15px_rgba(138,43,226,0.4)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold group-hover:text-purple-300 transition-colors">Token Mint</h3>
                      <p className="text-gray-400 text-sm">Minted 1 StickMan Token</p>
                      <p className="text-purple-400 text-xs mt-1 font-mono">
                        Signature: 4x8h...9k2m
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">+1 SMT</p>
                      <p className="text-gray-400 text-sm">2 minutes ago</p>
                      <p className="text-blue-400 text-xs mt-1">Status: Confirmed</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-purple-700/30">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Network: Devnet</span>
                      <span>Block: #123456789</span>
                    </div>
                  </div>
                </div>

                {/* Another Transaction Example */}
                <div 
                  onClick={() => handleTransactionClick('7y2p3n9q')}
                  className="p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg border border-purple-700/30 hover:shadow-[0_0_15px_rgba(138,43,226,0.4)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold group-hover:text-purple-300 transition-colors">Token Transfer</h3>
                      <p className="text-gray-400 text-sm">Transferred 5 StickMan Tokens</p>
                      <p className="text-purple-400 text-xs mt-1 font-mono">
                        Signature: 7y2p...3n9q
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold">-5 SMT</p>
                      <p className="text-gray-400 text-sm">5 minutes ago</p>
                      <p className="text-blue-400 text-xs mt-1">Status: Confirmed</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-purple-700/30">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Network: Devnet</span>
                      <span>Block: #123456788</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .arcade-text-glow {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.8);
        }
      `}</style>
    </div>
  );
} 