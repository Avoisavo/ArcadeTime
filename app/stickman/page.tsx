"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletContextState } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import StickWin from '@/components/stickwin';
import { Connection, clusterApiUrl, Transaction, PublicKey } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createMintToInstruction
} from '@solana/spl-token';

// Dynamically import the wallet button to avoid hydration issues
const WalletButton = dynamic(
  () => Promise.resolve(WalletMultiButton),
  { ssr: false }
);

// Predefined token mint address
const TOKEN_MINT_ADDRESS = '4oUSGe7v1vg1YxL7GgMuqk3NHB4ctAss5rDo6Tk2KxPx';

export default function StickmanGame() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<string>('');
  const { publicKey, connected, sendTransaction } = useWallet();
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [tokenAccount, setTokenAccount] = useState<PublicKey | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  // Game state references to access in animation frame
  const playerRef = useRef({
    x: 100,
    y: 400,
    width: 50,
    height: 100,
    speed: 5,
    jumping: false,
    attacking: false,
    attackCooldown: 0,
    health: 100,
    direction: 1, // 1 for right, -1 for left
    yVelocity: 0,
    frameCount: 0,
    animation: 0,
    label: "NOOB",
  });

  const enemyRef = useRef({
    x: 500,
    y: 400,
    width: 50,
    height: 100,
    speed: 3,
    health: 100,
    attacking: false,
    attackCooldown: 0,
    direction: -1,
    frameCount: 0,
    animation: 0,
    label: "ENEMIES",
  });

  // Controls state
  const keysRef = useRef({
    left: false,
    right: false,
    up: false,
    attack: false,
  });

  // Check token account when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      checkTokenAccount();
    }
  }, [connected, publicKey]);

  const checkTokenAccount = async () => {
    if (!publicKey) return;

    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Get the associated token account address
      const tokenMint = new PublicKey(TOKEN_MINT_ADDRESS);
      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        publicKey
      );
      
      setTokenAccount(userTokenAccount);
      
      // Check if the token account exists
      try {
        const accountInfo = await connection.getAccountInfo(userTokenAccount);
        setAccountCreated(accountInfo !== null);
      } catch (error) {
        console.error("Error checking token account:", error);
        setAccountCreated(false);
      }
    } catch (error) {
      console.error('Error checking token account:', error);
      setMintStatus('Error checking token account. Please try again later.');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setMintStatus('');
    
    // Reset player and enemy
    playerRef.current = {
      x: 100,
      y: 400,
      width: 50,
      height: 100,
      speed: 5,
      jumping: false,
      attacking: false,
      attackCooldown: 0,
      health: 100,
      direction: 1,
      yVelocity: 0,
      frameCount: 0,
      animation: 0,
      label: "NOOB",
    };
    
    enemyRef.current = {
      x: 500,
      y: 400,
      width: 50,
      height: 100,
      speed: 3,
      health: 100,
      attacking: false,
      attackCooldown: 0,
      direction: -1,
      frameCount: 0,
      animation: 0,
      label: "ENEMIES",
    };
  };

  const handleWin = async () => {
    if (!connected || !publicKey) {
      setMintStatus('Please connect your wallet to receive the token');
      return;
    }
    
    // If we're already minting, don't start another transaction
    if (isMinting) {
      return;
    }
    
    try {
      setIsMinting(true);
      setMintStatus('Minting your Stick-Man token...');
      
      // Connect to Solana
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // Get the token mint
      const tokenMint = new PublicKey(TOKEN_MINT_ADDRESS);
      
      // Create a new transaction
      const transaction = new Transaction();
      
      // If the token account doesn't exist, create it first
      if (!accountCreated && tokenAccount) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            tokenAccount, // associated token account
            publicKey, // owner
            tokenMint // mint
          )
        );
        setMintStatus('Creating token account...');
      }
      
      // Add instruction to mint 1 token to the user
      if (tokenAccount) {
        transaction.add(
          createMintToInstruction(
            tokenMint, // mint
            tokenAccount, // destination
            publicKey, // authority
            1 * Math.pow(10, 6) // amount with decimals (assuming 6 decimals)
          )
        );
      }
      
      // Get fresh blockhash
      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });
      
      setAccountCreated(true);
      setTransactionHash(signature);
      setMintStatus('Token minted successfully!');
    } catch (error) {
      console.error('Error minting token:', error);
      let errorMessage = 'Error minting token. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('429') || 
            error.message.includes('Too Many Requests') ||
            error.message.includes('rate limit')) {
          errorMessage = 'Rate limit reached. Please try again in a few minutes.';
        } else if (error.message.includes('0x1')) {
          errorMessage = 'Insufficient balance or missing mint authority. Make sure the wallet has proper permissions.';
        }
      }
      
      setMintStatus(errorMessage);
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          keysRef.current.left = true;
          break;
        case 'ArrowRight':
          keysRef.current.right = true;
          break;
        case 'ArrowUp':
          keysRef.current.up = true;
          break;
        case ' ':
          keysRef.current.up = true;
          break;
        case '1':
          router.push('/sticman1');
          break;
        case 'z':
        case 'Z':
          keysRef.current.attack = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          keysRef.current.left = false;
          break;
        case 'ArrowRight':
          keysRef.current.right = false;
          break;
        case 'ArrowUp':
          keysRef.current.up = false;
          break;
        case 'z':
        case 'Z':
          keysRef.current.attack = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Load background image
    const backgroundImage = new Image();
    backgroundImage.src = '/stickmanbg.png';
    
    let backgroundLoaded = false;
    backgroundImage.onload = () => {
      backgroundLoaded = true;
    };

    backgroundImage.onerror = () => {
      console.warn('Failed to load background image, using fallback');
      backgroundLoaded = false;
    };

    // Game loop
    let animationFrameId: number;

    const render = () => {
      if (!gameStarted) {
        // Don't run game logic if not started
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const player = playerRef.current;
      const enemy = enemyRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      if (backgroundLoaded) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback background with arcade theme
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid pattern
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.1)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Neon glow effect
        const glowGradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        glowGradient.addColorStop(0, 'rgba(138, 43, 226, 0.1)');
        glowGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ground with neon effect
        ctx.fillStyle = '#0f1c21';
        ctx.fillRect(0, 500, canvas.width, 100);
        
        // Ground glow
        const groundGlow = ctx.createLinearGradient(0, 500, 0, 510);
        groundGlow.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
        groundGlow.addColorStop(1, 'rgba(138, 43, 226, 0)');
        ctx.fillStyle = groundGlow;
        ctx.fillRect(0, 500, canvas.width, 10);
      }

      // Update player position based on input
      if (keysRef.current.left) {
        player.x -= player.speed;
        player.direction = -1;
      }
      if (keysRef.current.right) {
        player.x += player.speed;
        player.direction = 1;
      }
      if (keysRef.current.up && !player.jumping) {
        player.jumping = true;
        player.yVelocity = -15;
      }
      if (keysRef.current.attack && player.attackCooldown <= 0) {
        player.attacking = true;
        player.attackCooldown = 20; // Attack cooldown frames
      }

      // Apply gravity to player
      player.yVelocity += 0.8;
      player.y += player.yVelocity;

      // Ground collision
      if (player.y > 400) {
        player.y = 400;
        player.jumping = false;
        player.yVelocity = 0;
      }

      // Boundary collision
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

      // Update attack cooldown
      if (player.attackCooldown > 0) player.attackCooldown--;
      if (player.attackCooldown === 0) player.attacking = false;
      
      if (enemy.attackCooldown > 0) enemy.attackCooldown--;
      if (enemy.attackCooldown === 0) enemy.attacking = false;

      // Simple enemy AI
      // Move towards player
      if (enemy.x < player.x - 100) {
        enemy.x += enemy.speed;
        enemy.direction = 1;
      } else if (enemy.x > player.x + 100) {
        enemy.x -= enemy.speed;
        enemy.direction = -1;
      } else {
        // In attack range, try to attack
        if (Math.random() < 0.03 && enemy.attackCooldown <= 0) {
          enemy.attacking = true;
          enemy.attackCooldown = 40; // Enemy attack cooldown
        }
      }

      // Detect attacks
      if (player.attacking && 
          player.x + player.width * player.direction > enemy.x - 20 &&
          player.x < enemy.x + enemy.width + 20 &&
          Math.abs(player.y - enemy.y) < 80) {
        // Player hit enemy
        if (enemy.health > 0 && player.attackCooldown === 19) { // Only damage on first frame of attack
          enemy.health -= 10;
          setScore(prev => prev + 10);
          
          // Knockback
          enemy.x += player.direction * 30;
        }
      }

      if (enemy.attacking && 
          enemy.x + enemy.width * enemy.direction > player.x - 20 &&
          enemy.x < player.x + player.width + 20 &&
          Math.abs(player.y - enemy.y) < 80) {
        // Enemy hit player
        if (player.health > 0 && enemy.attackCooldown === 39) { // Only damage on first frame of attack
          player.health -= 5;
          
          // Knockback
          player.x -= enemy.direction * 20;
        }
      }

      // Check game over
      if (player.health <= 0 || enemy.health <= 0) {
        setGameOver(true);
        // Only show the win popup if player wins, and don't directly call handleWin()
        // to avoid double transaction prompts
        if (player.health > 0) {
          setShowWinPopup(true);
        }
      }
      
      // Animation frames
      player.frameCount++;
      enemy.frameCount++;
      
      if (player.frameCount % 10 === 0) {
        player.animation = (player.animation + 1) % 4;
      }
      
      if (enemy.frameCount % 10 === 0) {
        enemy.animation = (enemy.animation + 1) % 4;
      }

      // Draw player
      drawStickman(ctx, player.x, player.y, player.direction, player.animation, player.attacking, '#ffffff');
      
      // Draw label above player
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(player.label, player.x + 25, player.y - 30);
      
      // Draw enemy
      drawStickman(ctx, enemy.x, enemy.y, enemy.direction, enemy.animation, enemy.attacking, '#ff5555');
      
      // Draw label above enemy
      ctx.fillStyle = '#ff5555';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(enemy.label, enemy.x + 25, enemy.y - 30);

      // Draw health bars
      drawHealthBar(ctx, 50, 30, player.health, "#00ff00");
      drawHealthBar(ctx, canvas.width - 150, 30, enemy.health, "#ff0000");
      
      // Draw score
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, 40);

      // Draw controls guide
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText("Controls: Arrow Keys to move, Space to jump, Z to attack", 400, 580);

      if (gameOver) {
        // Draw game over
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px sans-serif';
        ctx.fillText(
          player.health <= 0 ? 'Game Over!' : 'You Win!', 
          canvas.width / 2 - 100, 
          canvas.height / 2 - 50
        );
        
        ctx.font = '24px sans-serif';
        ctx.fillText(
          `Final Score: ${score}`,
          canvas.width / 2 - 80,
          canvas.height / 2
        );
        
        ctx.font = '18px sans-serif';
        ctx.fillText(
          'Press Enter to play again',
          canvas.width / 2 - 100,
          canvas.height / 2 + 50
        );
      }

      // Check for win condition
      if (enemy.health <= 0 && !gameOver) {
        setGameOver(true);
        setShowWinPopup(true);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    function drawStickman(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number, frame: number, attacking: boolean, color: string) {
      ctx.save();
      ctx.translate(x + 25, y);
      if (direction < 0) {
        ctx.scale(-1, 1);
      }
      
      // Draw stickman
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      
      // Head
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      // Body
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(0, 50);
      ctx.stroke();
      
      // Legs
      const legAngle = Math.sin(frame * 0.5) * 0.4;
      
      ctx.beginPath();
      ctx.moveTo(0, 50);
      ctx.lineTo(-15, 90 + Math.sin(legAngle) * 5);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, 50);
      ctx.lineTo(15, 90 + Math.sin(legAngle + Math.PI) * 5);
      ctx.stroke();
      
      // Arms
      if (attacking) {
        // Attack animation
        ctx.beginPath();
        ctx.moveTo(0, 25);
        ctx.lineTo(-15, 40);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 25);
        ctx.lineTo(35, 20);
        ctx.stroke();
      } else {
        // Normal arms
        const armAngle = Math.sin(frame * 0.5) * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(0, 25);
        ctx.lineTo(-15, 50 + Math.sin(armAngle) * 5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 25);
        ctx.lineTo(15, 50 + Math.sin(armAngle + Math.PI) * 5);
        ctx.stroke();
      }
      
      ctx.restore();
    }

    function drawHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, health: number, color: string) {
      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(x, y, 100, 15);
      
      // Health
      ctx.fillStyle = color;
      ctx.fillRect(x, y, health, 15);
      
      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 100, 15);
    }

    // Handle restart game on Enter key
    const handleRestart = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameOver) {
        startGame();
      }
    };
    
    window.addEventListener('keydown', handleRestart);

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleRestart);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black arcade-bg py-8">
      {!connected && (
        <div className="mb-8 text-center">
          <p className="text-yellow-400 font-bold mb-4">Please connect your wallet to play and receive tokens</p>
          <WalletButton className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-600 hover:to-purple-400 text-white font-bold py-3 px-10 rounded-full text-xl uppercase tracking-wider transform hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.8)]" />
        </div>
      )}
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="border-4 border-purple-500/30 rounded-lg shadow-lg arcade-canvas purple-neon-border"
        />
        
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/90 to-black/90">
            <h2 className="text-5xl font-bold text-white mb-8 arcade-title-glow purple-pulse">Stick-Man Battle</h2>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-600 hover:to-purple-400 text-white font-bold py-3 px-10 rounded-full text-xl uppercase tracking-wider transform hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(138,43,226,0.5)] hover:shadow-[0_0_25px_rgba(138,43,226,0.8)]"
            >
              Start Game
            </button>
            <div className="mt-12 text-gray-300">
              <p className="text-center text-purple-300 font-bold uppercase tracking-wider arcade-text-glow purple-glow">Controls:</p>
              <ul className="mt-4 space-y-2 text-sm grid grid-cols-1 gap-2">
                <li className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 px-6 py-2 rounded border border-purple-700/30">
                  <span className="text-purple-400 font-medium">Arrow keys:</span> Move left/right
                </li>
                <li className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 px-6 py-2 rounded border border-purple-700/30">
                  <span className="text-purple-400 font-medium">Space/Up arrow:</span> Jump
                </li>
                <li className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 px-6 py-2 rounded border border-purple-700/30">
                  <span className="text-purple-400 font-medium">Z key:</span> Attack
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <Link 
          href="/library" 
          className="text-purple-400 hover:text-purple-300 transition-colors font-bold uppercase tracking-wider arcade-text-glow purple-glow"
        >
          ← Back to Game Library
        </Link>
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
          <p className="text-white mb-4">Score: {score}</p>
          
          {mintStatus && !mintStatus.includes('Error') && !transactionHash && (
            <p className="text-gray-300 mb-2 text-sm">
              {mintStatus}
            </p>
          )}
          
          {mintStatus && mintStatus.includes('Error') && (
            <p className="text-red-400 mb-2 text-sm">
              {mintStatus}
            </p>
          )}
          
          {transactionHash && (
            <div className="mb-3 text-center">
              <p className="text-green-500 font-medium">Token minted successfully! Transaction:</p>
              <p className="text-purple-600 break-words max-w-xs mx-auto my-1 font-medium">
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
          
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-md font-bold uppercase tracking-wider transform hover:scale-105 transition-all duration-300 shadow-[0_0_10px_rgba(138,43,226,0.5)] hover:shadow-[0_0_15px_rgba(138,43,226,0.8)]"
            disabled={isMinting}
          >
            {isMinting ? 'Minting...' : 'Play Again'}
          </button>
        </div>
      )}

      {showWinPopup && (
        <StickWin 
          onClose={() => {
            setShowWinPopup(false);
            setGameStarted(false);
            setGameOver(false);
          }} 
          onMint={handleWin}  // Pass the mint function to the popup
          mintStatus={mintStatus}
          isMinting={isMinting}
          transactionHash={transactionHash}
        />
      )}

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

        .arcade-title-glow {
          text-shadow: 
            0 0 5px #fff, 
            0 0 10px #fff, 
            0 0 15px #8a2be2, 
            0 0 20px #8a2be2, 
            0 0 25px #8a2be2;
          animation: pulsate 2s infinite alternate;
        }

        .arcade-canvas {
          box-shadow: 
            0 0 0 4px rgba(138,43,226,0.3),
            0 0 30px rgba(138,43,226,0.2),
            0 0 60px rgba(138,43,226,0.1);
        }

        /* Purple Neon Styles */
        .purple-neon {
          text-shadow: 
            0 0 2px #fff, 
            0 0 5px rgba(138,43,226,0.8), 
            0 0 10px rgba(138,43,226,0.5);
        }
        
        .purple-glow {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.8);
        }

        .purple-pulse {
          text-shadow: 
            0 0 5px #fff, 
            0 0 10px #fff, 
            0 0 15px #8a2be2, 
            0 0 20px #8a2be2, 
            0 0 25px #8a2be2;
          animation: purplePulsate 2s infinite alternate;
        }

        .purple-neon-border {
          box-shadow: 
            0 0 0 4px rgba(138,43,226,0.3),
            0 0 30px rgba(138,43,226,0.2);
        }

        @keyframes pulsate {
          0% { opacity: 0.9; }
          100% { opacity: 1; }
        }

        @keyframes purplePulsate {
          0% { opacity: 0.9; text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #8a2be2, 0 0 20px #8a2be2, 0 0 25px #8a2be2; }
          100% { opacity: 1; text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #8a2be2, 0 0 20px #8a2be2, 0 0 30px #8a2be2, 0 0 40px #8a2be2; }
        }
      `}</style>
    </div>
  );
}
