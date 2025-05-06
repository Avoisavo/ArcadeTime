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

export default function Library() {
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
    setSelectedGame(game);
  };

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeTab="Games" />
      <div className="flex flex-1 relative">
        <Navbar activePage="my games" />
        <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] ml-64 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Arcade Game Library</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomGames.map((game) => (
                <div 
                  key={game.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedGame?.id === game.id 
                      ? "border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900/20" 
                      : "border-gray-200 hover:border-blue-300 hover:shadow"
                  }`}
                  onClick={() => (game.title === "Stick-Man" || game.title === "Space Invaders") ? null : handleSelectGame(game)}
                >
                  {game.title === "Stick-Man" ? (
                    <Link href="/stickman" className="flex flex-col h-full">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-md h-48 relative mb-4 flex items-center justify-center overflow-hidden">
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
                      <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{game.description}</p>
                      <p className="text-gray-500 text-xs mt-auto">Released: {game.year}</p>
                    </Link>
                  ) : game.title === "Space Invaders" ? (
                    <Link href="/spaceinvaders" className="flex flex-col h-full">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-md h-48 relative mb-4 flex items-center justify-center overflow-hidden">
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
                      <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{game.description}</p>
                      <p className="text-gray-500 text-xs mt-auto">Released: {game.year}</p>
                    </Link>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-md h-48 relative mb-4 flex items-center justify-center overflow-hidden">
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
                      <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{game.description}</p>
                      <p className="text-gray-500 text-xs mt-auto">Released: {game.year}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedGame && (
              <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">Selected Game: {selectedGame.title}</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md h-64 relative flex items-center justify-center overflow-hidden">
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
                      <h3 className="text-xl font-semibold mb-3">{selectedGame.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedGame.description}</p>
                      <p className="text-gray-500 mb-8">Released: {selectedGame.year}</p>
                      <Link href={selectedGame.title === "Stick-Man" ? "/stickman" : selectedGame.title === "Space Invaders" ? "/spaceinvaders" : "#"}>
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                          Play Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-12">
              <Link href="/" className="text-blue-500 hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
