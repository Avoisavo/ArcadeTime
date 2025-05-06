"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function StickmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    
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
        // Fallback background
        ctx.fillStyle = '#1a2e35';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw some hills
        ctx.fillStyle = '#0f1c21';
        ctx.beginPath();
        ctx.moveTo(0, 450);
        ctx.quadraticCurveTo(200, 400, 400, 450);
        ctx.lineTo(0, 450);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(400, 450);
        ctx.quadraticCurveTo(600, 350, 800, 450);
        ctx.lineTo(400, 450);
        ctx.fill();
      }

      // Draw ground
      ctx.fillStyle = '#0f1c21';
      ctx.fillRect(0, 500, canvas.width, 100);

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
      ctx.fillText("Controls: Arrow Keys to move, Space to jump, Z to attack", 20, 580);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Stick-Man Battle</h1>
        {!gameStarted && !gameOver && (
          <p className="text-gray-300 text-center max-w-md">
            Control your stick figure warrior and defeat your opponent in an epic duel!
          </p>
        )}
      </div>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="border-4 border-gray-700 rounded-lg shadow-lg"
        />
        
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
            <h2 className="text-4xl font-bold text-white mb-8">Stick-Man Battle</h2>
            <button 
              onClick={startGame}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-colors"
            >
              Start Game
            </button>
            <div className="mt-8 text-gray-300">
              <p><span className="font-bold">Controls:</span></p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Arrow keys: Move left/right</li>
                <li>Space/Up arrow: Jump</li>
                <li>Z key: Attack</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Link 
          href="/library" 
          className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          ← Back to Game Library
        </Link>
      </div>
    </div>
  );
}
