import React, { useState } from 'react';

const TOKENS = [
  { symbol: 'STICKMAN', name: 'Stickman' },
  { symbol: 'SPACE', name: 'Space' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'PACMAN', name: 'Pacman' },
  { symbol: 'TETRIS', name: 'Tetris' },
];

interface SwapProps {
  onSwap: (from: string, to: string, amount: number) => void;
  balances: Record<string, number>;
}

const Swap: React.FC<SwapProps> = ({ onSwap, balances }) => {
  const [fromToken, setFromToken] = useState('SPACE');
  const [toToken, setToToken] = useState('STICKMAN');
  const [amount, setAmount] = useState(0.1);
  const [error, setError] = useState('');

  const handleSwap = () => {
    setError('');
    if (fromToken === toToken) {
      setError('Choose different tokens to swap.');
      return;
    }
    if (amount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (balances[fromToken] === undefined || balances[fromToken] < amount) {
      setError(`Insufficient ${fromToken} balance.`);
      return;
    }
    onSwap(fromToken, toToken, amount);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">Token Swap</h2>
      <div className="flex space-x-2">
        <select
          value={fromToken}
          onChange={e => setFromToken(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {TOKENS.map(token => (
            <option key={token.symbol} value={token.symbol}>{token.name}</option>
          ))}
        </select>
        <span className="text-white font-bold">→</span>
        <select
          value={toToken}
          onChange={e => setToToken(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {TOKENS.map(token => (
            <option key={token.symbol} value={token.symbol}>{token.name}</option>
          ))}
        </select>
      </div>
      <input
        type="number"
        min="0.0001"
        step="0.0001"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        className="bg-gray-800 text-white px-3 py-2 rounded w-32 text-center"
      />
      <button
        onClick={handleSwap}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded font-bold hover:from-blue-500 hover:to-purple-500 transition-all"
      >
        Swap
      </button>
      {error && <div className="text-red-400 font-bold mt-2">{error}</div>}
      <div className="mt-4 w-full">
        <h3 className="text-white text-sm font-bold mb-1">Your Balances</h3>
        <ul className="text-gray-300 text-xs">
          {TOKENS.map(token => (
            <li key={token.symbol}>
              {token.name}: {balances[token.symbol] ?? 0}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Swap;
