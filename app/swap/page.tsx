'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
import { mintStickManToken } from '@/utils/tokenMint';
import { initializeSpaceToken } from '@/utils/spaceTokenMint';
import Link from 'next/link';

const SPACE_TOKEN = {
  symbol: 'SPACE',
  name: 'Token',
};
const STICKMAN_TOKEN = {
  symbol: 'STICKMAN',
  name: 'Token',
};

const RECIPIENT_ADDRESS = '9zCCYVxpYYUiA9EvBPUcKPDGCquEE1JKNA8jcybfdkkc';

export default function SwapPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [fromToken] = useState(SPACE_TOKEN);
  const [toToken] = useState(STICKMAN_TOKEN);
  const [amount, setAmount] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [message, setMessage] = useState('');
  const [spaceTokenMint, setSpaceTokenMint] = useState<PublicKey | null>(null);

  useEffect(() => {
    const initializeTokens = async () => {
      try {
        const spaceMint = await initializeSpaceToken();
        setSpaceTokenMint(spaceMint);
      } catch (error) {
        console.error('Error initializing tokens:', error);
        setMessage('Error initializing tokens. Please try again.');
      }
    };

    initializeTokens();
  }, []);

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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-3xl font-extrabold mb-6 text-white text-center arcade-glow uppercase tracking-widest" style={{fontFamily: 'Press Start 2P, monospace'}}>Token Transfer</h2>
        <div className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-2xl p-8 shadow-2xl border-2 border-purple-500 arcade-border-glow relative" style={{maxWidth: 400, minWidth: 320}}>
          <div className="mb-6">
            <label className="block text-purple-300 text-xs mb-2 tracking-widest uppercase arcade-glow">Transfer</label>
            <div className="flex items-center bg-gray-900 rounded px-4 py-3 border border-purple-700/40 arcade-inner-glow">
              <span className="font-extrabold text-purple-400 mr-2 text-lg arcade-glow">{fromToken.symbol}</span>
              <span className="text-gray-200 text-xs">{fromToken.name}</span>
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
              className="w-full px-4 py-3 rounded-lg bg-black text-white border-2 border-purple-700/40 focus:outline-none focus:ring-2 focus:ring-purple-500 arcade-inner-glow text-xl font-mono text-center transition-all duration-300 placeholder-gray-500"
              placeholder="0.0"
              disabled={swapping}
              style={{fontFamily: 'Press Start 2P, monospace'}}
            />
          </div>
          <div className="mb-6">
            <label className="block text-blue-300 text-xs mb-2 tracking-widest uppercase arcade-glow">Receive</label>
            <div className="flex items-center bg-gray-900 rounded px-4 py-3 border border-blue-700/40 arcade-inner-glow">
              <span className="font-extrabold text-blue-400 mr-2 text-lg arcade-glow">{toToken.symbol}</span>
              <span className="text-gray-200 text-xs">{toToken.name}</span>
            </div>
            <div className="mt-2 text-sm text-purple-300 arcade-glow">
              You will receive {amount || '0'} {toToken.symbol}
            </div>
          </div>
          <button
            onClick={handleSwap}
            disabled={swapping || !amount || Number(amount) <= 0 || !wallet.publicKey}
            className="w-full py-4 mt-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold text-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 arcade-glow tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            style={{fontFamily: 'Press Start 2P, monospace'}}
          >
            {swapping ? 'Processing...' : 'Transfer'}
          </button>
          {message && (
            <div className="mt-6 text-center text-purple-300 arcade-glow text-lg" style={{fontFamily: 'Press Start 2P, monospace'}}>
              {message}
            </div>
          )}
          <div className="absolute -inset-0.5 rounded-2xl pointer-events-none arcade-animated-border"></div>
        </div>
        <Link 
          href="/library" 
          className="mt-8 text-purple-400 hover:text-purple-300 hover:underline transition-colors arcade-text-glow text-sm uppercase tracking-wider font-bold"
          style={{fontFamily: 'Press Start 2P, monospace'}}
        >
          Return to Library
        </Link>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .arcade-glow {
          text-shadow: 0 0 2px #fff, 0 0 4px #a78bfa, 0 0 6px #6366f1;
        }
        .arcade-inner-glow {
          box-shadow: 0 0 4px 1px #a78bfa33, 0 0 1px #6366f1;
        }
        .arcade-border-glow {
          box-shadow: 0 0 8px 2px #a78bfa99, 0 0 2px #6366f1;
        }
        .arcade-animated-border {
          border: 2px solid #a78bfa;
          background: none;
          filter: none;
          animation: arcade-border-move 2s linear infinite;
        }
        @keyframes arcade-border-move {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
