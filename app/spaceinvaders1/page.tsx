"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Press_Start_2P } from 'next/font/google';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function SpaceInvaders() {
  const { publicKey } = useWallet();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(2010);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [tokenMinted, setTokenMinted] = useState(false);
  const router = useRouter();

  // Constants
  const ENEMY_ROWS = 3;
  const ENEMY_COLS = 5;
  const ENEMY_SPACING_X = 70;
  const ENEMY_SPACING_Y = 60;
  const ENEMY_START_X = 250;
  const ENEMY_START_Y = 120;

  // Game state references to access in animation frame
  const playerRef = useRef({
    x: 400,
    y: 500,
    width: 50,
    height: 30,
    speed: 6,
    lives: 3,
    name: "PRO"
  });

  const bulletsRef = useRef<Array<{x: number, y: number, speed: number}>>([]);
  const enemyBulletsRef = useRef<Array<{x: number, y: number, speed: number}>>([]);
  
  // Enemy grid state
  const enemiesRef = useRef<Array<Array<{x: number, y: number, alive: boolean, type: number}>>>([]);
  
  // Enemy movement
  const enemyMovementRef = useRef({
    direction: 1, // 1 right, -1 left
    speed: 0.5,
    dropAmount: 20,
    moveCounter: 0,
  });

  // Controls state
  const keysRef = useRef({
    left: false,
    right: false,
    shoot: false,
    shootCooldown: 0,
  });

  const initializeEnemies = () => {
    const enemies: Array<Array<{x: number, y: number, alive: boolean, type: number}>> = [];
    
    // Create a triangle formation of enemies
    for (let row = 0; row < ENEMY_ROWS; row++) {
      const enemyRow: Array<{x: number, y: number, alive: boolean, type: number}> = [];
      
      // Set enemy type based on row
      let type = 0; // Light purple enemies (bottom rows)
      if (row === 0) type = 2; // Bright purple enemies (top row)
      else if (row === 1) type = 1; // Medium purple enemies (middle row)
      
      // Calculate how many ships to put in this row to form a triangle
      // Top row has 1 ship, middle row has 3, bottom row has 5
      const shipsInRow = (row * 2) + 1;
      const startOffset = (ENEMY_COLS - shipsInRow) * ENEMY_SPACING_X / 2;
      
      for (let col = 0; col < shipsInRow; col++) {
        enemyRow.push({
          x: ENEMY_START_X + startOffset + col * ENEMY_SPACING_X,
          y: ENEMY_START_Y + row * ENEMY_SPACING_Y,
          alive: true,
          type
        });
      }
      
      enemies.push(enemyRow);
    }
    
    return enemies;
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    
    // Reset player
    playerRef.current = {
      x: 400,
      y: 500,
      width: 50,
      height: 30,
      speed: 6,
      lives: 3,
      name: "PRO"
    };
    
    // Reset bullets
    bulletsRef.current = [];
    enemyBulletsRef.current = [];
    
    // Reset enemies
    enemiesRef.current = initializeEnemies();
    
    // Reset enemy movement
    enemyMovementRef.current = {
      direction: 1,
      speed: 0.5,
      dropAmount: 20,
      moveCounter: 0,
    };
  };

  const checkWinCondition = async () => {
    // Check if all enemies are destroyed
    const allEnemiesDestroyed = enemiesRef.current.every(row => 
      row.every(enemy => !enemy.alive)
    );

    if (allEnemiesDestroyed && !gameWon) {
      setGameWon(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cloud state
    const cloudCount = 7;
    const clouds = Array.from({ length: cloudCount }).map((_, i) => ({
      x: Math.random() * canvas.width,
      y: 40 + Math.random() * (canvas.height - 200),
      speed: 0.5 + Math.random() * 0.7,
      scale: 0.8 + Math.random() * 1.2
    }));

    // Add click handler to redirect to library
    const handleCanvasClick = () => {
      window.location.href = '/library';
    };
    
    canvas.addEventListener('click', handleCanvasClick);

    // Set up event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          keysRef.current.left = true;
          break;
        case 'ArrowRight':
          keysRef.current.right = true;
          break;
        case ' ':
          keysRef.current.shoot = true;
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
        case ' ':
          keysRef.current.shoot = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Initialize enemies
    if (enemiesRef.current.length === 0) {
      enemiesRef.current = initializeEnemies();
    }

    // Game loop
    let animationFrameId: number;

    const bulletImg = new window.Image();
    bulletImg.src = '/inventory/sigmastick.png';
    let bulletImgLoaded = false;
    bulletImg.onload = () => { bulletImgLoaded = true; };

    const render = () => {
      if (!gameStarted) {
        // Draw title screen
        drawCloudBackground(ctx, canvas, clouds);
        drawTitleScreen(ctx, canvas);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Clear canvas
      ctx.fillStyle = '#b3e5fc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCloudBackground(ctx, canvas, clouds);
      
      // Player movement
      const player = playerRef.current;
      if (keysRef.current.left && player.x > 0) {
        player.x -= player.speed;
      }
      if (keysRef.current.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
      }
      
      // Shooting
      if (keysRef.current.shoot && keysRef.current.shootCooldown <= 0) {
        bulletsRef.current.push({
          x: player.x + player.width / 2 - 2,
          y: player.y - 10,
          speed: 10
        });
        keysRef.current.shootCooldown = 20; // Cooldown frames
      }
      
      if (keysRef.current.shootCooldown > 0) {
        keysRef.current.shootCooldown--;
      }
      
      // Update bullets
      const bullets = bulletsRef.current;
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        
        // Remove bullets that go off screen
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
          continue;
        }
        
        // Check for collision with enemies
        let hitEnemy = false;
        for (let row = 0; row < enemiesRef.current.length; row++) {
          for (let col = 0; col < enemiesRef.current[row].length; col++) {
            const enemy = enemiesRef.current[row][col];
            if (enemy.alive) {
              // Simple collision check
              if (bullets[i] && 
                  bullets[i].x >= enemy.x - 20 && 
                  bullets[i].x <= enemy.x + 20 && 
                  bullets[i].y >= enemy.y - 15 && 
                  bullets[i].y <= enemy.y + 15) {
                
                // Enemy hit
                enemiesRef.current[row][col].alive = false;
                bullets.splice(i, 1);
                hitEnemy = true;
                
                // Add score based on enemy type
                const points = enemy.type === 2 ? 30 : (enemy.type === 1 ? 20 : 10);
                setScore(prevScore => {
                  const newScore = prevScore + points;
                  if (newScore > highScore) {
                    setHighScore(newScore);
                  }
                  return newScore;
                });
                
                break;
              }
            }
          }
          if (hitEnemy) break;
        }
      }
      
      // Enemy bullets
      const enemyBullets = enemyBulletsRef.current;
      
      // Randomly fire from enemies
      if (Math.random() < 0.02 && enemyBullets.length < 3) {
        // Select a random bottom-most living enemy to shoot
        const aliveEnemies: {row: number, col: number}[] = [];
        
        for (let col = 0; col < ENEMY_COLS; col++) {
          for (let row = ENEMY_ROWS - 1; row >= 0; row--) {
            if (enemiesRef.current[row] && 
                enemiesRef.current[row][col] && 
                enemiesRef.current[row][col].alive) {
              aliveEnemies.push({row, col});
              break;
            }
          }
        }
        
        if (aliveEnemies.length > 0) {
          const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          const enemy = enemiesRef.current[randomEnemy.row][randomEnemy.col];
          
          enemyBullets.push({
            x: enemy.x,
            y: enemy.y + 20,
            speed: 5
          });
        }
      }
      
      // Update enemy bullets
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;
        
        // Remove bullets that go off screen
        if (enemyBullets[i].y > canvas.height) {
          enemyBullets.splice(i, 1);
          continue;
        }
        
        // Check for collision with player
        if (enemyBullets[i].x >= player.x && 
            enemyBullets[i].x <= player.x + player.width && 
            enemyBullets[i].y >= player.y && 
            enemyBullets[i].y <= player.y + player.height) {
          
          // Player hit
          player.lives--;
          enemyBullets.splice(i, 1);
          
          if (player.lives <= 0) {
            setGameOver(true);
          }
        }
      }
      
      // Update enemy movement
      const enemyMovement = enemyMovementRef.current;
      enemyMovement.moveCounter += enemyMovement.speed;
      
      if (enemyMovement.moveCounter >= 1) {
        enemyMovement.moveCounter = 0;
        
        let shouldChangeDirection = false;
        let allEnemiesDestroyed = true;
        
        // Move all enemies
        for (let row = 0; row < enemiesRef.current.length; row++) {
          for (let col = 0; col < enemiesRef.current[row].length; col++) {
            const enemy = enemiesRef.current[row][col];
            
            if (enemy.alive) {
              allEnemiesDestroyed = false;
              
              // Move horizontally
              enemy.x += enemyMovement.direction * 2;
              
              // Check if any enemy reached the edge
              if ((enemy.x < 20 && enemyMovement.direction < 0) || 
                  (enemy.x > canvas.width - 20 && enemyMovement.direction > 0)) {
                shouldChangeDirection = true;
              }
              
              // Check if enemies reached the player
              if (enemy.y >= player.y - 40) {
                setGameOver(true);
              }
            }
          }
        }
        
        if (allEnemiesDestroyed) {
          setGameWon(true);
        }
        
        if (shouldChangeDirection) {
          // Change direction and drop down
          enemyMovement.direction *= -1;
          
          for (let row = 0; row < enemiesRef.current.length; row++) {
            for (let col = 0; col < enemiesRef.current[row].length; col++) {
              if (enemiesRef.current[row][col].alive) {
                enemiesRef.current[row][col].y += enemyMovement.dropAmount;
              }
            }
          }
          
          // Increase speed as game progresses
          enemyMovement.speed = Math.min(enemyMovement.speed + 0.05, 2);
        }
      }
      
      // Check win condition after updating game state
      checkWinCondition();
      
      // Draw
      drawGame(ctx, canvas);
      
      if (gameOver || gameWon) {
        drawGameEnd(ctx, canvas);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    function drawCloudBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, clouds: Array<{x: number, y: number, speed: number, scale: number}>) {
      // Move and draw clouds
      for (let cloud of clouds) {
        cloud.x += cloud.speed;
        if (cloud.x - 60 * cloud.scale > canvas.width) {
          cloud.x = -120 * cloud.scale;
          cloud.y = 40 + Math.random() * (canvas.height - 200);
          cloud.scale = 0.8 + Math.random() * 1.2;
          cloud.speed = 0.5 + Math.random() * 0.7;
        }
        drawCloud(ctx, cloud.x, cloud.y, cloud.scale);
      }
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

    function drawTitleScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Background - black
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create an arcade-style neon effect for the title
      // Base layer - dark outline
      ctx.fillStyle = '#3b0764'; // dark purple
      ctx.font = `bold 48px ${pressStart2P.style.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('SPACE INVADERS', canvas.width / 2 + 4, canvas.height / 3 + 4);
      
      // Middle glow layer
      ctx.fillStyle = '#7e22ce'; // purple-700
      ctx.fillText('SPACE INVADERS', canvas.width / 2 + 2, canvas.height / 3 + 2);
      
      // Main text with glow
      const gradient = ctx.createLinearGradient(0, canvas.height / 3 - 40, 0, canvas.height / 3 + 10);
      gradient.addColorStop(0, '#7dd3fc'); // cyan-300
      gradient.addColorStop(0.5, '#38bdf8'); // cyan-400
      gradient.addColorStop(1, '#0ea5e9'); // blue-500
      
      ctx.fillStyle = gradient;
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
      
      // Add pixelated glow effect to title
      ctx.shadowColor = '#bae6fd'; // blue-100
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
      
      // Add second glow layer for intensity
      ctx.shadowColor = '#bae6fd'; // blue-100
      ctx.shadowBlur = 30;
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
      ctx.shadowBlur = 0;
      
      // Create a "flicker" effect based on time
      if (Math.sin(Date.now() * 0.003) > 0.95) {
        // Occasionally dim the text slightly to simulate neon flicker
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#38bdf8'; // cyan-400
        ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
        ctx.globalAlpha = 1.0;
      }
      
      // Instructions
      ctx.fillStyle = '#7dd3fc'; // cyan-300
      ctx.font = '20px monospace';
      ctx.fillText('PRESS ENTER TO START', canvas.width / 2, canvas.height / 2);
      ctx.fillText('ARROW KEYS TO MOVE, SPACE TO SHOOT', canvas.width / 2, canvas.height / 2 + 40);
      

      
      // Draw sample enemies
      const enemyTypes = ['#8b5cf6', '#c084fc', '#d8b4fe']; // purple tones
      const enemyLabels = ['= 10 PTS', '= 20 PTS', '= 30 PTS'];
      
      for (let i = 0; i < 3; i++) {
        drawEnemy(ctx, canvas.width / 2 - 120, canvas.height / 2 + 80 + i * 40, i);
        ctx.fillStyle = '#7dd3fc'; // cyan-300
        ctx.textAlign = 'left';
        ctx.fillText(enemyLabels[i], canvas.width / 2 - 70, canvas.height / 2 + 90 + i * 40);
      }
    }

    function drawGame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Draw HUD
      ctx.fillStyle = '#000000'; // black
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('1UP', 50, 30);
      
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HIGH SCORE', canvas.width / 2, 30);
      
      ctx.fillStyle = '#000000'; // black
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(score.toString().padStart(4, '0'), 50, 60);
      
      ctx.textAlign = 'center';
      ctx.fillText(highScore.toString().padStart(4, '0'), canvas.width / 2, 60);
      
      // Draw player ship
      const player = playerRef.current;
      drawPlayer(ctx, player.x, player.y);
      
      // Draw player name
      ctx.fillStyle = '#000000'; // black
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(player.name, player.x + player.width / 2, player.y - 10);
      
      // Draw lives
      for (let i = 0; i < player.lives; i++) {
        drawPlayer(ctx, 30 + i * 40, canvas.height - 40, 0.7);
      }
      
      // Draw player bullets
      for (const bullet of bulletsRef.current) {
        if (bulletImgLoaded) {
          ctx.drawImage(bulletImg, bullet.x, bullet.y, 72, 84);
        } else {
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(bullet.x, bullet.y, 4, 10);
        }
      }
      
      // Draw enemy bullets
      ctx.fillStyle = '#bae6fd'; // blue-100
      for (const bullet of enemyBulletsRef.current) {
        ctx.shadowColor = '#bae6fd';
        ctx.shadowBlur = 8;
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
        ctx.shadowBlur = 0;
      }
      
      // Draw enemies
      for (let row = 0; row < enemiesRef.current.length; row++) {
        for (let col = 0; col < enemiesRef.current[row].length; col++) {
          const enemy = enemiesRef.current[row][col];
          if (enemy.alive) {
            drawEnemy(ctx, enemy.x, enemy.y, enemy.type);
          }
        }
      }
    }

    function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number = 1) {
      ctx.fillStyle = '#2563eb'; // blue-500
      
      // Add glow effect for player ship
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      
      // Base of ship
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 50 * scale, y);
      ctx.lineTo(x + 50 * scale, y + 10 * scale);
      ctx.lineTo(x + 35 * scale, y + 10 * scale);
      ctx.lineTo(x + 25 * scale, y + 20 * scale);
      ctx.lineTo(x + 15 * scale, y + 10 * scale);
      ctx.lineTo(x, y + 10 * scale);
      ctx.closePath();
      ctx.fill();
      
      // Cockpit
      ctx.fillStyle = '#38bdf8'; // cyan-400
      ctx.fillRect(x + 20 * scale, y, 10 * scale, 7 * scale);
      
      // Reset shadow effect
      ctx.shadowBlur = 0;
    }

    function drawEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, type: number) {
      const enemyTypes = ['#8b5cf6', '#c084fc', '#d8b4fe']; // purple tones for enemies
      ctx.fillStyle = enemyTypes[type];
      
      // Add glow effect
      ctx.shadowColor = enemyTypes[type];
      ctx.shadowBlur = 8;
      
      // Body
      ctx.beginPath();
      ctx.moveTo(x - 15, y - 10);
      ctx.lineTo(x + 15, y - 10);
      ctx.lineTo(x + 15, y + 5);
      ctx.lineTo(x - 15, y + 5);
      ctx.closePath();
      ctx.fill();
      
      // Wings
      ctx.beginPath();
      ctx.moveTo(x - 20, y - 5);
      ctx.lineTo(x - 15, y - 10);
      ctx.lineTo(x - 15, y + 5);
      ctx.lineTo(x - 20, y + 10);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x + 20, y - 5);
      ctx.lineTo(x + 15, y - 10);
      ctx.lineTo(x + 15, y + 5);
      ctx.lineTo(x + 20, y + 10);
      ctx.closePath();
      ctx.fill();
      
      // Cockpit
      ctx.fillStyle = '#f5f3ff'; // white with purple tint
      ctx.fillRect(x - 5, y - 5, 10, 5);
      
      // Reset shadow effect
      ctx.shadowBlur = 0;
    }

    function drawGameEnd(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Overlay
      ctx.fillStyle = 'rgba(46, 16, 101, 0.7)'; // purple-950 with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create neon text effect
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 15;
      
      ctx.fillStyle = '#000000'; // black
      ctx.font = `bold 40px ${pressStart2P.style.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(gameWon ? 'YOU WIN!' : 'GAME OVER', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '20px monospace';
      ctx.fillStyle = '#000000'; // black
      ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
      
      // Add token award status
      if (gameWon) {
        ctx.fillStyle = '#000000'; // black
        ctx.fillText(tokenMinted ? 'TOKEN AWARDED: 1' : 'MINTING TOKEN', canvas.width / 2, canvas.height / 2 + 80);
      }
      
      ctx.fillText('PRESS ENTER TO PLAY AGAIN', canvas.width / 2, canvas.height / 2 + 120);
      
      // Reset shadow effect
      ctx.shadowBlur = 0;
    }

    // Handle Enter key to start game
    const handleStart = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!gameStarted || gameOver || gameWon) {
          startGame();
        }
      }
      // Redirect to /games when '2' is pressed
      if (e.key === '2') {
        router.push('/games');
      }
    };
    
    window.addEventListener('keydown', handleStart);

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleStart);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, gameWon, highScore, publicKey, tokenMinted, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 via-blue-200 to-blue-100 arcade-bg py-8">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="border-4 border-purple-500 rounded-lg shadow-lg shadow-purple-600/30"
        />
      </div>
      
      <div className="mt-6">
        <Link 
          href="/library" 
          className="text-black hover:text-purple-200 transition-colors font-medium"
        >
          ← Back to Game Library
        </Link>
      </div>
      <style jsx global>{`
        .arcade-bg {
          background-image: 
            linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 60%, #f0f9ff 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: lighten, multiply;
        }
      `}</style>
    </div>
  );
}
