"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { mintStickManToken, initializeToken } from '@/utils/tokenMint';

export default function StickmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<string>('');
  const { publicKey, connected } = useWallet();

  // Game state references to access in animation frame
  const playerRef = useRef({
    x: 100,
    y: 440,
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
    label: "PRO",
  });

  const enemyRef = useRef({
    x: 500,
    y: 440,
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

  // Initialize token when component mounts
  useEffect(() => {
    const initToken = async () => {
      try {
        await initializeToken();
      } catch (error) {
        console.error('Error initializing token:', error);
        setMintStatus('Error initializing token system. Please try again later.');
      }
    };

    initToken();
  }, []);

  // Initialize game state when component mounts
  useEffect(() => {
    // Reset player and enemy
    playerRef.current = {
      x: 100,
      y: 440,
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
      label: "PRO",
    };
    
    enemyRef.current = {
      x: 500,
      y: 440,
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
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    
    // Reset player and enemy
    playerRef.current = {
      x: 100,
      y: 440,
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
      y: 440,
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

    try {
      setIsMinting(true);
      setMintStatus('Minting your Stick-Man token...');
      const signature = await mintStickManToken(publicKey.toBase58());
      setMintStatus(`Token minted successfully! Transaction: ${signature}`);
    } catch (error) {
      console.error('Error minting token:', error);
      setMintStatus('Error minting token. Please try again.');
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
        case ' ':
          keysRef.current.up = true;
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
        case ' ':
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
    backgroundImage.src = '/arcade/stickmanbg.png';
    
    let backgroundLoaded = false;
    backgroundImage.onload = () => {
      backgroundLoaded = true;
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
        // --- Vibrant blue sky gradient ---
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#6ec6ff'); // Top sky blue
        skyGradient.addColorStop(0.7, '#b3e5fc'); // Lighter blue
        skyGradient.addColorStop(1, '#e1f5fe'); // Near white at horizon
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- Fluffy clouds ---
        drawCloud(ctx, 120, 80, 1.2);
        drawCloud(ctx, 300, 60, 0.8);
        drawCloud(ctx, 600, 100, 1.5);
        drawCloud(ctx, 500, 50, 0.7);

        // --- Sun with glow and subtle rays ---
        // Sun glow
        const sunX = 700, sunY = 100, sunR = 50;
        const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR, sunX, sunY, sunR + 40);
        sunGlow.addColorStop(0, 'rgba(255, 223, 70, 0.8)');
        sunGlow.addColorStop(1, 'rgba(255, 223, 70, 0)');
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR + 40, 0, Math.PI * 2);
        ctx.fillStyle = sunGlow;
        ctx.fill();
        // Sun body
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Sun rays
        ctx.strokeStyle = 'rgba(255, 223, 70, 0.7)';
        ctx.lineWidth = 4;
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI) / 6;
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(angle) * (sunR + 5), sunY + Math.sin(angle) * (sunR + 5));
          ctx.lineTo(sunX + Math.cos(angle) * (sunR + 25), sunY + Math.sin(angle) * (sunR + 25));
          ctx.stroke();
        }

        // --- Mountain layers ---
        // Furthest (lightest)
        drawMountainRange(ctx, [
          {x: 0, y: 400}, {x: 100, y: 320}, {x: 250, y: 370}, {x: 400, y: 300}, {x: 600, y: 350}, {x: 800, y: 320}, {x: 800, y: 600}, {x: 0, y: 600}
        ], '#b2dfdb');
        // Middle
        drawMountainRange(ctx, [
          {x: 0, y: 450}, {x: 120, y: 340}, {x: 300, y: 420}, {x: 500, y: 340}, {x: 700, y: 420}, {x: 800, y: 370}, {x: 800, y: 600}, {x: 0, y: 600}
        ], '#388e3c');
        // Foreground (darkest)
        drawMountainRange(ctx, [
          {x: 0, y: 500}, {x: 200, y: 380}, {x: 400, y: 480}, {x: 600, y: 400}, {x: 800, y: 500}, {x: 800, y: 600}, {x: 0, y: 600}
        ], '#2e7d32');

        // --- Mountain shadow on ground ---
        ctx.fillStyle = 'rgba(44, 62, 80, 0.15)';
        ctx.beginPath();
        ctx.moveTo(0, 500);
        ctx.lineTo(200, 380);
        ctx.lineTo(400, 480);
        ctx.lineTo(600, 400);
        ctx.lineTo(800, 500);
        ctx.lineTo(800, 520);
        ctx.lineTo(0, 520);
        ctx.closePath();
        ctx.fill();

        // --- Rolling green hills ---
        ctx.fillStyle = '#8bc34a';
        ctx.beginPath();
        ctx.moveTo(0, 520);
        for (let x = 0; x <= canvas.width; x += 40) {
          ctx.quadraticCurveTo(x + 20, 510 + Math.sin(x / 80) * 10, x + 40, 520);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        // --- Grass details ---
        ctx.strokeStyle = '#558b2f';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 18) {
          ctx.beginPath();
          ctx.moveTo(x, 520);
          ctx.lineTo(x + 6, 510 + Math.random() * 8);
          ctx.stroke();
        }

        // --- Cute birds ---
        for (let i = 0; i < 5; i++) {
          const x = 100 + i * 120 + Math.sin(Date.now() / 1000 + i) * 10;
          const y = 80 + Math.cos(Date.now() / 1200 + i) * 10;
          drawCuteBird(ctx, x, y, i % 2 === 0 ? 1 : -1);
        }

        // --- Flowers and bushes ---
        for (let i = 0; i < 8; i++) {
          drawFlower(ctx, 60 + i * 90, 550 + Math.sin(i) * 5, ['#ff69b4', '#fff176', '#f06292', '#fff'][i % 4]);
        }
        drawBush(ctx, 180, 540, 1);
        drawBush(ctx, 600, 545, 1.3);
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
        
        // Special victory background effect when player wins
        if (player.health > 0) {
          // Create victory particle effect
          for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 4 + 2;
            
            // Draw stars
            ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.5})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw sparkles
            ctx.strokeStyle = `rgba(138, 43, 226, ${Math.random() * 0.5 + 0.5})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - size * 2, y);
            ctx.lineTo(x + size * 2, y);
            ctx.moveTo(x, y - size * 2);
            ctx.lineTo(x, y + size * 2);
            ctx.stroke();
          }
          
          // Victory gradient background
          const victoryGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          victoryGradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
          victoryGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
          victoryGradient.addColorStop(1, 'rgba(138, 43, 226, 0.3)');
          ctx.fillStyle = victoryGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw victory/defeat text with enhanced styling
        ctx.fillStyle = player.health > 0 ? '#FFD700' : '#ffffff';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = player.health > 0 ? '#8A2BE2' : '#ff0000';
        ctx.shadowBlur = 15;
        ctx.fillText(
          player.health > 0 ? 'VICTORY!' : 'Game Over!', 
          canvas.width / 2, 
          canvas.height / 2 - 50
        );
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Draw score with enhanced styling
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(
          `Final Score: ${score}`,
          canvas.width / 2,
          canvas.height / 2
        );
        
        // Draw play again text with enhanced styling
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#8A2BE2';
        ctx.fillText(
          'Press Enter to play again',
          canvas.width / 2,
          canvas.height / 2 + 50
        );
      }

      // Check for win condition
      if (enemy.health <= 0 && !gameOver) {
        setGameOver(true);
        handleWin();
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

    function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(x, y, 30 * scale, 18 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 20 * scale, y + 5 * scale, 22 * scale, 14 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 20 * scale, y + 8 * scale, 18 * scale, 12 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawMountainRange(ctx: CanvasRenderingContext2D, points: {x: number, y: number}[], color: string) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    function drawCuteBird(ctx: CanvasRenderingContext2D, x: number, y: number, dir: number) {
      ctx.save();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 7, Math.PI * 0.2, Math.PI * 0.8, false); // body
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + dir * 7, y - 2, 2, 0, Math.PI * 2); // head
      ctx.stroke();
      ctx.restore();
    }

    function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
      ctx.save();
      ctx.strokeStyle = '#388e3c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.fillStyle = color;
        const angle = (i * Math.PI * 2) / 5;
        ctx.ellipse(x + Math.cos(angle) * 4, y + Math.sin(angle) * 4, 3, 5, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.restore();
    }

    function drawBush(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
      ctx.save();
      ctx.fillStyle = '#43a047';
      ctx.beginPath();
      ctx.arc(x, y, 14 * scale, 0, Math.PI * 2);
      ctx.arc(x + 12 * scale, y + 2 * scale, 10 * scale, 0, Math.PI * 2);
      ctx.arc(x - 12 * scale, y + 2 * scale, 10 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#6ec6ff] to-[#e1f5fe] arcade-bg py-8">
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="border-4 border-[#ff00ff]/30 rounded-lg shadow-lg arcade-canvas neon-border"
        />
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link 
          href="/library" 
          className="text-black hover:text-[#ff00ff] transition-colors font-bold uppercase tracking-wider arcade-text-glow cyan-glow text-center"
        >
          ← Back to Game Library
        </Link>
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
          <p className="text-white mb-4">Score: {score}</p>
          {mintStatus && (
            <p className={`text-sm ${mintStatus.includes('Error') ? 'text-red-400' : 'text-[#00ffff]'} mb-4`}>
              {mintStatus}
            </p>
          )}
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-[#ff00ff] to-[#00ffff] hover:from-[#00ffff] hover:to-[#ff00ff] text-white px-6 py-2 rounded-md font-bold uppercase tracking-wider transform hover:scale-105 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,255,0.5)] hover:shadow-[0_0_15px_rgba(0,255,255,0.8)]"
            disabled={isMinting}
          >
            {isMinting ? 'Minting...' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  );
}