import React, { useEffect, useState } from 'react';

export default function StickWin({ onClose }: { onClose: () => void }) {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-xs w-full relative">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">You won a new asset!</h2>
        <div className="flex items-center justify-center w-40 h-40 mb-4 relative">
          {/* Centered bling background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img src="/bling.gif" alt="bling" className="w-32 h-32 object-contain opacity-80" />
          </div>
          {/* Asset image */}
          <img
            src="/inventory/obamastick.png"
            alt="New Asset"
            className={`transition-transform duration-700 ease-out z-10 relative ${showImage ? 'scale-100' : 'scale-0'}`}
            style={{ transformOrigin: 'center', transitionProperty: 'transform', width: '100%', height: '100%' }}
          />
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md font-bold uppercase tracking-wider hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Close
        </button>
        <style jsx>{`
          .scale-0 { transform: scale(0); opacity: 0; }
          .scale-100 { transform: scale(1); opacity: 1; }
        `}</style>
      </div>
    </div>
  );
}
