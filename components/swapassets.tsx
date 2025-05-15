import React, { useRef, useState } from 'react';

interface SwapAssetsProps {
  open: boolean;
  onClose: () => void;
  onSwap?: (selectedGame: { name: string; img: string } | null) => void;
}

const SwapAssets: React.FC<SwapAssetsProps> = ({ open, onClose, onSwap }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedAsset, setSelectedAsset] = useState<{ name: string; img: string } | null>(null);
  const gameOptions = [
    { name: 'Tetris', img: '/arcade/tetris.png' },
    { name: 'Space Invaders', img: '/arcade/space-invaders.png' },
    { name: 'Stick Man', img: '/arcade/stick-man.png' },
    { name: 'Pac-Man', img: '/arcade/pacman.png' },
  ];
  const [selectedGame, setSelectedGame] = useState<{ name: string; img: string } | null>(null);
  const [showGameOptions, setShowGameOptions] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  React.useEffect(() => {
    setPosition({
      x: window.innerWidth / 2 - 350,
      y: window.innerHeight / 2 - 250
    });
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={modalRef}
        className="absolute bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-lg shadow-2xl border-2 border-purple-500 arcade-border-glow"
        style={{
          width: 750,
          height: 600,
          left: position.x,
          top: position.y,
          cursor: dragging ? 'grabbing' : 'grab',
          pointerEvents: 'auto'
        }}
      >
        {/* Drag bar */}
        <div
          className="w-full h-12 flex items-center justify-between px-6 border-b-2 border-purple-500 cursor-move bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-t-lg"
          onMouseDown={onMouseDown}
        >
          <span className="font-bold text-xl text-white arcade-text-shadow">Swap Assets</span>
          <button 
            onClick={onClose} 
            className="text-purple-300 hover:text-red-400 text-2xl transition-colors arcade-glow"
          >
            ×
          </button>
        </div>
        {/* Modal Content */}
        <div className="p-8">
          <div className="flex justify-between mb-4">
            <span className="text-xl text-purple-300 arcade-glow">ASSETS</span>
            <span className="text-xl text-purple-300 arcade-glow">CHOOSE A GAME</span>
          </div>
          <div className="flex justify-between mb-8">
            <div
              className="border-2 border-purple-500 w-80 h-64 flex items-center justify-center bg-gray-900/50 rounded-lg arcade-border-glow"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                const data = e.dataTransfer.getData('application/json');
                if (data) {
                  try {
                    const asset = JSON.parse(data);
                    setSelectedAsset(asset);
                  } catch {}
                }
              }}
            >
              {selectedAsset ? (
                <div className="flex flex-col items-center">
                  <img
                    src={selectedAsset.img}
                    alt={selectedAsset.name}
                    className="w-20 h-20 mb-2 arcade-motion"
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('application/json', JSON.stringify(selectedAsset));
                    }}
                    onDragEnd={e => {
                      // If dropped outside the modal, remove the asset
                      const modal = modalRef.current;
                      if (modal) {
                        const rect = modal.getBoundingClientRect();
                        const x = e.clientX;
                        const y = e.clientY;
                        // If mouse is outside modal bounds
                        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                          setSelectedAsset(null);
                        }
                      }
                    }}
                  />
                  <span className="text-purple-300 arcade-glow">{selectedAsset.name}</span>
                </div>
              ) : (
                <span className="text-purple-300 arcade-glow">SELECT ASSET</span>
              )}
            </div>
            <div className="flex flex-col items-center justify-center w-32">
              <span className="text-xl text-purple-300 mb-2 arcade-glow">SWAP TO</span>
              <div className="w-12 h-12 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
            <div
              className="border-2 border-purple-500 w-80 h-64 flex items-center justify-center bg-gray-900/50 rounded-lg arcade-border-glow"
              onClick={() => setShowGameOptions(true)}
            >
              {selectedGame && !showGameOptions ? (
                <div className="flex flex-col items-center cursor-pointer">
                  {selectedGame.img && <img src={selectedGame.img} alt={selectedGame.name} className="w-20 h-20 mb-2 arcade-motion" />}
                  <span className="text-purple-300 arcade-glow">{selectedGame.name}</span>
                  <span className="text-xs text-purple-400 mt-2">(Click to change)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <span className="text-purple-300 arcade-glow mb-2">SELECT GAME</span>
                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    {gameOptions.map(game => (
                      <button
                        key={game.name}
                        className="flex flex-col items-center bg-black/40 border border-purple-500 rounded-lg p-2 hover:bg-purple-800/40 transition cursor-pointer"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedGame(game);
                          setShowGameOptions(false);
                        }}
                      >
                        {game.img && <img src={game.img} alt={game.name} className="w-10 h-10 mb-1" />}
                        <span className="text-xs text-purple-200 arcade-glow">{game.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {swapSuccess && (
            <div className="mb-4 text-green-400 text-center font-bold text-lg">
              Swap successful! Your asset is now swapped to Space Invaders.
            </div>
          )}
          <button
            className="border-2 border-purple-500 w-full h-20 flex items-center justify-center bg-gray-900/50 rounded-lg arcade-border-glow text-xl text-purple-300 arcade-glow transition hover:bg-purple-700/30 focus:outline-none"
            type="button"
            onClick={() => {
              if (onSwap) onSwap(selectedGame);
              setSwapSuccess(true);
            }}
          >
            Swap
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapAssets;
