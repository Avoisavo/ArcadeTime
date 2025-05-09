import React, { useState } from 'react';

const SPACE_TOKEN = {
  symbol: 'SPACE',
  name: 'Space Token',
};
const STICKMAN_TOKEN = {
  symbol: 'STICKMAN',
  name: 'StickMan Token',
};

const Swap: React.FC = () => {
  const [fromToken] = useState(SPACE_TOKEN);
  const [toToken] = useState(STICKMAN_TOKEN);
  const [amount, setAmount] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [message, setMessage] = useState('');

  const handleSwap = async () => {
    setSwapping(true);
    setMessage('Swapping... (not implemented)');
    setTimeout(() => {
      setSwapping(false);
      setMessage('Swap complete! (UI only)');
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-3xl font-extrabold mb-6 text-white text-center arcade-glow uppercase tracking-widest" style={{fontFamily: 'Press Start 2P, monospace'}}>Arcade Swap</h2>
      <div className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-2xl p-8 shadow-2xl border-2 border-purple-500 arcade-border-glow relative" style={{maxWidth: 400, minWidth: 320}}>
        <div className="mb-6">
          <label className="block text-purple-300 text-xs mb-2 tracking-widest uppercase arcade-glow">From</label>
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
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black text-white border-2 border-purple-700/40 focus:outline-none focus:ring-2 focus:ring-purple-500 arcade-inner-glow text-xl font-mono text-center transition-all duration-300 placeholder-gray-500"
            placeholder="0.0"
            disabled={swapping}
            style={{fontFamily: 'Press Start 2P, monospace'}}
          />
        </div>
        <div className="mb-6">
          <label className="block text-blue-300 text-xs mb-2 tracking-widest uppercase arcade-glow">To</label>
          <div className="flex items-center bg-gray-900 rounded px-4 py-3 border border-blue-700/40 arcade-inner-glow">
            <span className="font-extrabold text-blue-400 mr-2 text-lg arcade-glow">{toToken.symbol}</span>
            <span className="text-gray-200 text-xs">{toToken.name}</span>
          </div>
        </div>
        <button
          onClick={handleSwap}
          disabled={swapping || !amount || Number(amount) <= 0}
          className="w-full py-4 mt-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold text-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 arcade-glow tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          style={{fontFamily: 'Press Start 2P, monospace'}}
        >
          {swapping ? 'Swapping...' : 'Swap'}
        </button>
        {message && <div className="mt-6 text-center text-purple-300 arcade-glow text-lg" style={{fontFamily: 'Press Start 2P, monospace'}}>{message}</div>}
        {/* Subtle neon border effect */}
        <div className="absolute -inset-0.5 rounded-2xl pointer-events-none arcade-animated-border"></div>
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
};

export default Swap;
