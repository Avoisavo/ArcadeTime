'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
import { mintStickManToken } from '@/utils/tokenMint';
import Link from 'next/link';

const SPACE_TOKEN = {
  symbol: 'SPACE',
  name: 'Space Token',
  decimals: 9,
};
const STICKMAN_TOKEN = {
  symbol: 'STICKMAN',
  name: 'Stickman Token',
  decimals: 9,
};
const PACMAN_TOKEN = {
  symbol: 'PACMAN',
  name: 'Pacman Token',
  decimals: 9,
};
const SOL_TOKEN = {
  symbol: 'SOL',
  name: 'Solana',
  decimals: 9,
};

const TOKENS = [SOL_TOKEN, SPACE_TOKEN, STICKMAN_TOKEN, PACMAN_TOKEN];

const RECIPIENT_ADDRESS = '9zCCYVxpYYUiA9EvBPUcKPDGCquEE1JKNA8jcybfdkkc';

export default function SwapPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [fromToken, setFromToken] = useState(SOL_TOKEN);
  const [toToken, setToToken] = useState(SPACE_TOKEN);
  const [amount, setAmount] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [message, setMessage] = useState('');
  const [spaceTokenMint, setSpaceTokenMint] = useState<PublicKey | null>(null);

  const handleSwap = async () => {
    if (!wallet.publicKey || !spaceTokenMint) {
      setMessage('Please connect your wallet and ensure tokens are initialized.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    try {
      setSwapping(true);
      setMessage('Processing transfer...');

      // Get the associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        spaceTokenMint,
        wallet.publicKey
      );

      const recipientPublicKey = new PublicKey(RECIPIENT_ADDRESS);
      const recipientTokenAccount = await getAssociatedTokenAddress(
        spaceTokenMint,
        recipientPublicKey
      );

      // Create transaction
      const transaction = new Transaction();

      // Check if recipient token account exists, if not create it
      try {
        await connection.getAccountInfo(recipientTokenAccount);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            recipientTokenAccount,
            recipientPublicKey,
            spaceTokenMint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          fromTokenAccount,
          recipientTokenAccount,
          wallet.publicKey,
          Number(amount) * Math.pow(10, 9) // Assuming 9 decimals
        )
      );

      // Send transaction
      const signature = await wallet.sendTransaction(transaction, connection);
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });

      // After successful transfer, mint STICKMAN tokens
      const mintSignature = await mintStickManToken(wallet.publicKey.toString());
      await connection.confirmTransaction({
        signature: mintSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });

      setMessage(`Transfer complete! Transaction: ${signature}`);
      setAmount(''); // Clear the input after successful transfer
    } catch (error: any) {
      console.error('Error during transfer:', error);
      let errorMessage = 'Error during transfer. Please try again.';
      
      if (error?.message?.includes('429') || 
          error?.message?.includes('Too Many Requests') ||
          error?.message?.includes('rate limit')) {
        errorMessage = 'Rate limit reached. Please try again in a few minutes.';
      }
      
      setMessage(errorMessage);
    } finally {
      setSwapping(false);
    }
  };

  const handleTokenChange = (side: 'from' | 'to', token: typeof SOL_TOKEN) => {
    if (side === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setAmount(''); // Reset amount when tokens change
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-arcade arcade-bg flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-4xl font-extrabold mb-8 text-white text-center arcade-text-shadow animate-pulse uppercase tracking-widest">Token Transfer</h2>
        <div className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-2xl p-8 shadow-2xl border-2 border-purple-500 arcade-border-glow relative arcade-card-glow" style={{maxWidth: 400, minWidth: 320}}>
          <div className="mb-6">
            <label className="block text-purple-300 text-xs mb-2 tracking-widest uppercase arcade-glow">Transfer</label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center bg-gray-900 rounded px-4 py-3 border border-purple-700/40 arcade-inner-glow hover:scale-105 transition-transform">
                <select
                  value={fromToken.symbol}
                  onChange={(e) => handleTokenChange('from', TOKENS.find(t => t.symbol === e.target.value) || SOL_TOKEN)}
                  className="bg-transparent text-purple-400 font-extrabold text-lg arcade-glow focus:outline-none cursor-pointer"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-900">
                      {token.symbol}
                    </option>
                  ))}
                </select>
                <span className="text-gray-200 text-xs ml-2">{fromToken.name}</span>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-purple-300 text-xs mb-2 tracking-widest uppercase arcade-glow">Amount</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black text-white border-2 border-purple-700/40 focus:outline-none focus:ring-2 focus:ring-purple-500 arcade-inner-glow text-xl font-mono text-center transition-all duration-300 placeholder-gray-500 hover:scale-105"
              placeholder="0.0"
              disabled={swapping}
            />
          </div>
          <div className="mb-6">
            <label className="block text-blue-300 text-xs mb-2 tracking-widest uppercase arcade-glow">Receive</label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center bg-gray-900 rounded px-4 py-3 border border-blue-700/40 arcade-inner-glow hover:scale-105 transition-transform">
                <select
                  value={toToken.symbol}
                  onChange={(e) => handleTokenChange('to', TOKENS.find(t => t.symbol === e.target.value) || SPACE_TOKEN)}
                  className="bg-transparent text-blue-400 font-extrabold text-lg arcade-glow focus:outline-none cursor-pointer"
                >
                  {TOKENS.map((token) => (
                    <option key={token.symbol} value={token.symbol} className="bg-gray-900">
                      {token.symbol}
                    </option>
                  ))}
                </select>
                <span className="text-gray-200 text-xs ml-2">{toToken.name}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-purple-300 arcade-glow">
              You will receive {amount || '0'} {toToken.symbol}
            </div>
          </div>
          <button
            onClick={handleSwap}
            disabled={swapping || !amount || Number(amount) <= 0 || !wallet.publicKey}
            className="w-full py-4 mt-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold text-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 arcade-glow tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed arcade-btn"
          >
            {swapping ? 'Processing...' : 'Transfer'}
          </button>
          {message && (
            <div className="mt-6 text-center text-purple-300 arcade-glow text-lg">
              {message}
            </div>
          )}
          <div className="absolute -inset-0.5 rounded-2xl pointer-events-none arcade-animated-border"></div>
        </div>
        <Link 
          href="/library" 
          className="mt-8 text-purple-400 hover:text-purple-300 hover:underline transition-colors arcade-text-glow text-sm uppercase tracking-wider font-bold"
        >
          Return to Library
        </Link>
      </div>
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
        .arcade-inner-glow {
          box-shadow: 0 0 4px 1px #a78bfa33, 0 0 1px #6366f1;
        }
        .arcade-border-glow {
          box-shadow: 0 0 8px 2px #a78bfa99, 0 0 2px #6366f1;
        }
        .arcade-text-shadow {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.8), 0 0 10px rgba(138,43,226,0.5);
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 2px;
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
        .arcade-card-glow:hover {
          box-shadow: 0 0 15px rgba(138,43,226,0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .arcade-btn {
          position: relative;
          overflow: hidden;
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 1px;
        }
        .arcade-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255,255,255,0.1) 50%,
            transparent 100%
          );
          transform: rotate(45deg);
          animation: button-shine 3s linear infinite;
        }
        @keyframes button-shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }
        .arcade-bg {
          background-image: 
            linear-gradient(to bottom, rgba(25,25,25,1) 0%, rgba(10,10,10,1) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: multiply;
        }
        .arcade-bg::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
          pointer-events: none;
          z-index: 2;
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: 'Press Start 2P', monospace;
        }
        select:focus {
          outline: none;
        }
        select option {
          background-color: #1a1a2e;
          color: white;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}
