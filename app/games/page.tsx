"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Header from "@/components/header";

// Define the arcade game type
interface ArcadeGame {
  id: number;
  title: string;
  description: string;
  image: string;
  year: number;
  color: string;
}

// Arcade game data
const arcadeGames: ArcadeGame[] = [
  {
    id: 1,
    title: "Pac-Man",
    description: "Navigate through a maze while eating dots and avoiding ghosts.",
    image: "/arcade/pacman.png",
    year: 1980,
    color: "bg-yellow-500",
  },
  {
    id: 2,
    title: "Space Invaders",
    description: "Defend Earth from waves of descending alien invaders.",
    image: "/arcade/space-invaders.png",
    year: 1978,
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Stick-Man",
    description: "Two stick figures battle against each other in an intense duel to the finish.",
    image: "/arcade/stick-man.png",
    year: 1995,
    color: "bg-red-500",
  },
  {
    id: 4,
    title: "Galaga",
    description: "Shoot down swarms of alien ships in this space shooter.",
    image: "/arcade/galaga.png",
    year: 1981,
    color: "bg-blue-500",
  },
  {
    id: 7,
    title: "Tetris",
    description: "Arrange falling blocks to create complete lines.",
    image: "/arcade/tetris.png",
    year: 1984,
    color: "bg-purple-500",
  },
];

// Fallback component when images aren't available
const GameImageFallback = ({ title, color }: { title: string; color: string }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${color} text-white font-bold p-4 text-center`}>
      {title}
    </div>
  );
};

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<ArcadeGame | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [randomGames, setRandomGames] = useState<ArcadeGame[]>([]);
  
  // Get 5 random arcade games
  const getRandomGames = (count: number): ArcadeGame[] => {
    const shuffled = [...arcadeGames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Use useEffect to ensure random selection only happens client-side
  useEffect(() => {
    setRandomGames(getRandomGames(5));
  }, []);
  
  const handleSelectGame = (game: ArcadeGame): void => {
    window.open('https://explorer.solana.com/address/ANuRhZia44rvZpR1zX2bSiRLHEbDWzmMwtLwzMTpuwSB/tokens?cluster=devnet', '_blank');
  };

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-black arcade-bg">
      <Header activeTab="Games" />
      <div className="flex flex-1 relative">
        <Navbar activePage="all games" />
        <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] ml-64 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-white arcade-text-shadow">Arcade Games</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomGames.map((game) => (
                <div 
                  key={game.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all arcade-card-glow ${
                    selectedGame?.id === game.id 
                      ? 'border-purple-500 shadow-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 arcade-selected-card' 
                      : 'border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:bg-gradient-to-br hover:from-purple-900/10 hover:to-blue-900/10'
                  }`}
                  onClick={() => {
                    if (game.title === "Space Invaders") {
                      window.location.href = "/spaceinvaders";
                    } else if (game.title === "Stick-Man") {
                      window.location.href = "/stickman";
                    } else {
                      handleSelectGame(game);
                    }
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-md h-48 relative mb-4 flex items-center justify-center overflow-hidden arcade-game-container">
                      {imageErrors[game.id] ? (
                        <GameImageFallback title={game.title} color={game.color} />
                      ) : (
                        <div className="relative w-full h-full">
                          <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <div className="w-32 h-32 relative">
                              <Image
                                src={game.image}
                                alt={game.title}
                                fill
                                style={{ objectFit: "contain" }}
                                onError={() => handleImageError(game.id)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-white arcade-game-title">{game.title}</h2>
                    <p className="text-gray-400 text-sm mb-2">{game.description}</p>
                    <p className="text-purple-400 text-xs mt-auto">Released: {game.year}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedGame && (
              <div className="mt-12 border-t border-purple-900/30 pt-8">
                <h2 className="text-2xl font-bold mb-4 text-white arcade-text-shadow">Selected Game: {selectedGame.title}</h2>
                <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg border border-purple-900/30 arcade-details-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-md h-64 relative flex items-center justify-center overflow-hidden arcade-game-container">
                      {imageErrors[selectedGame.id] ? (
                        <GameImageFallback title={selectedGame.title} color={selectedGame.color} />
                      ) : (
                        <div className="relative w-full h-full">
                          <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <div className="w-48 h-48 relative">
                              <Image
                                src={selectedGame.image}
                                alt={selectedGame.title}
                                fill
                                style={{ objectFit: "contain" }}
                                onError={() => handleImageError(selectedGame.id)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white arcade-text-glow">{selectedGame.title}</h3>
                      <p className="text-gray-400 mb-4">{selectedGame.description}</p>
                      <p className="text-purple-400 mb-8">Released: {selectedGame.year}</p>
                      <button 
                        onClick={() => {
                          if (selectedGame.title === "Space Invaders") {
                            window.location.href = "/spaceinvaders";
                          } else if (selectedGame.title === "Stick-Man") {
                            window.location.href = "/stickman";
                          }
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-md font-bold uppercase tracking-wider transform hover:scale-105 transition-all duration-300 shadow-[0_0_10px_rgba(138,43,226,0.5)] hover:shadow-[0_0_15px_rgba(138,43,226,0.8)]"
                      >
                        Play Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .arcade-bg {
          background-image: 
            linear-gradient(to bottom, rgba(25,25,25,1) 0%, rgba(10,10,10,1) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: multiply;
        }
        
        .arcade-text-shadow {
          text-shadow: 
            0 0 2px #fff, 
            0 0 5px rgba(138,43,226,0.8), 
            0 0 10px rgba(138,43,226,0.5);
        }
        
        .arcade-text-glow {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.8);
        }
        
        .arcade-card-glow:hover {
          box-shadow: 0 0 15px rgba(138,43,226,0.3);
        }
        
        .arcade-selected-card {
          box-shadow: 0 0 20px rgba(138,43,226,0.4) !important;
        }
        
        .arcade-game-title {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.6);
        }
        
        .arcade-game-container {
          box-shadow: inset 0 0 20px rgba(0,0,0,0.6);
          border: 1px solid rgba(138,43,226,0.3);
        }
        
        .arcade-details-card {
          box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
} 