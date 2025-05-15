import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { mintNFT } from '@/utils/nft-minter';

export default function StickWin({ 
  onClose
}: { 
  onClose: () => void;
}) {
  const [showImage, setShowImage] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const wallet = useWallet();

  const defaultIcons = {
    stickman: '/arcade/stick-man.png',
    poison: '/arcade/galaga.png',
    shield: '/arcade/galaga.png',
  };

  const [assetGameIcons, setAssetGameIcons] = useState(defaultIcons);

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedIcons = localStorage.getItem('assetGameIcons');
    if (savedIcons) {
      setAssetGameIcons(JSON.parse(savedIcons));
    }
  }, []);

  // Handler for the mint button
  const handleMint = async () => {
    if (!wallet.connected) {
      setMintStatus('Error: Wallet not connected');
      return;
    }

    try {
      setIsMinting(true);
      
      // Call the simplified minting function with fixed metadata URI
      const result = await mintNFT(
        wallet,
        (status) => setMintStatus(status)
      );
      
      // Set the transaction hash to display to the user
      setTransactionHash(result.signature);
      setMintStatus(`Successfully minted SigmaStick NFT!`);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-sm w-full relative">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">You won a new asset!</h2>
        <div className="flex items-center justify-center w-40 h-40 mb-4 relative">
          {/* Centered bling background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img src="/bling.gif" alt="bling" className="w-32 h-32 object-contain opacity-80" />
          </div>
          {/* Asset image */}
          <img
            src="/inventory/sigmastick.png"
            alt="New Asset"
            className={`transition-transform duration-700 ease-out z-10 relative ${showImage ? 'scale-100' : 'scale-0'}`}
            style={{ transformOrigin: 'center', transitionProperty: 'transform', width: '100%', height: '100%' }}
          />
        </div>
        
        {/* Success message and transaction hash styling to match screenshot */}
        {transactionHash && (
          <div className="text-center w-full px-4">
            <p className="text-green-500 font-medium">Token minted successfully! Transaction:</p>
            <p className="text-purple-600 break-words w-full my-1 font-medium">
              {transactionHash}
            </p>
            <a 
              href={`https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 text-xs underline"
            >
              View Transaction
            </a>
          </div>
        )}
        
        {/* Error message */}
        {mintStatus && mintStatus.includes('Error') && (
          <p className="text-red-500 mt-2 mb-2 text-center text-sm">
            {mintStatus}
          </p>
        )}
        
        {/* Status message during minting */}
        {mintStatus && !mintStatus.includes('Error') && !transactionHash && (
          <p className="text-gray-600 mt-2 mb-2 text-center text-sm">
            {mintStatus}
          </p>
        )}
        
        <div className="flex flex-col space-y-3 mt-4 w-full">
          {!transactionHash && (
            <button
              onClick={handleMint}
              disabled={isMinting || !wallet.connected}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md font-bold uppercase tracking-wider hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMinting ? 'Minting...' : wallet.connected ? 'Mint Token' : 'Connect Wallet to Mint'}
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-bold uppercase tracking-wider hover:bg-gray-300 transition-all"
          >
            CLOSE
          </button>
        </div>
        
        <style jsx>{`
          .scale-0 { transform: scale(0); opacity: 0; }
          .scale-100 { transform: scale(1); opacity: 1; }
        `}</style>
      </div>
    </div>
  );
}
