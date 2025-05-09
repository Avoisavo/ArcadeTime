"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Press_Start_2P } from 'next/font/google';
import { useWallet } from '@solana/wallet-adapter-react';
import { mintSpaceToken } from '@/utils/spaceTokenMint';

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
    name: "NOOB"
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
      name: "NOOB"
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
      
      // Mint token if wallet is connected and token hasn't been minted yet
      if (publicKey && !tokenMinted) {
        try {
          const signature = await mintSpaceToken(publicKey.toString());
          console.log('Space token minted successfully:', signature);
          setTokenMinted(true);
        } catch (error: any) {
          console.error('Error minting Space token:', error);
          // Show error message in the game over screen
          let errorMessage = 'Error minting token. Please try again later.';
          
          if (error?.message?.includes('429')) {
            errorMessage = 'Devnet airdrop limit reached. Please visit https://faucet.solana.com to get test SOL manually.';
          } else if (error?.message?.includes('insufficient funds')) {
            errorMessage = 'Mint authority needs funding. Please contact the game administrator.';
          }
          
          // Update the game over screen to show the error
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = 'rgba(46, 16, 101, 0.7)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              ctx.fillStyle = '#d8b4fe';
              ctx.font = `bold 40px ${pressStart2P.style.fontFamily}`;
              ctx.textAlign = 'center';
              ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2 - 50);
              
              ctx.font = '20px monospace';
              ctx.fillStyle = '#c084fc';
              ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2);
              ctx.fillText('PRESS ENTER TO PLAY AGAIN', canvas.width / 2, canvas.height / 2 + 50);
              
              // Show error message
              ctx.fillStyle = '#f0abfc';
              ctx.font = '16px monospace';
              // Split long error message into multiple lines
              const words = errorMessage.split(' ');
              let line = '';
              let y = canvas.height / 2 + 100;
              for (const word of words) {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > canvas.width - 100) {
                  ctx.fillText(line, canvas.width / 2, y);
                  line = word + ' ';
                  y += 25;
                } else {
                  line = testLine;
                }
              }
              ctx.fillText(line, canvas.width / 2, y);
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const render = () => {
      if (!gameStarted) {
        // Draw title screen
        drawTitleScreen(ctx, canvas);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      drawStars(ctx, canvas);
      
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

    function drawStars(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Draw random stars with purple hues
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(i * 0.1 + Date.now() * 0.0005) + 1) * canvas.width/2;
        const y = (Math.cos(i * 0.13 + Date.now() * 0.0003) + 1) * canvas.height/2;
        const size = (Math.sin(i * 0.5 + Date.now() * 0.001) + 1) * 1.5;
        
        // Random purple shade for stars
        const purpleShade = Math.floor(Math.random() * 3);
        if (purpleShade === 0) ctx.fillStyle = '#a78bfa'; // purple-400
        else if (purpleShade === 1) ctx.fillStyle = '#c4b5fd'; // purple-300
        else ctx.fillStyle = '#f5f3ff'; // white with purple tint
        
        ctx.fillRect(x, y, size, size);
      }
    }

    function drawTitleScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Background - black
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      drawStars(ctx, canvas);
      
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
      gradient.addColorStop(0, '#d946ef'); // pink-500
      gradient.addColorStop(0.5, '#c026d3'); // fuchsia-600
      gradient.addColorStop(1, '#a21caf'); // fuchsia-800
      
      ctx.fillStyle = gradient;
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
      
      // Add pixelated glow effect to title
      ctx.shadowColor = '#e879f9'; // pink-400
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
      
      // Add second glow layer for intensity
      ctx.shadowColor = '#f0abfc'; // pink-300
      ctx.shadowBlur = 30;
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
      ctx.shadowBlur = 0;
      
      // Create a "flicker" effect based on time
      if (Math.sin(Date.now() * 0.003) > 0.95) {
        // Occasionally dim the text slightly to simulate neon flicker
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#c026d3'; // fuchsia-600
        ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
        ctx.globalAlpha = 1.0;
      }
      
      // Instructions
      ctx.fillStyle = '#d8b4fe'; // purple-300
      ctx.font = '20px monospace';
      ctx.fillText('PRESS ENTER TO START', canvas.width / 2, canvas.height / 2);
      ctx.fillText('ARROW KEYS TO MOVE, SPACE TO SHOOT', canvas.width / 2, canvas.height / 2 + 40);
      
      // Add click to return to library instruction
      ctx.fillStyle = '#a78bfa'; // purple-400
      ctx.font = '18px monospace';
      ctx.fillText('CLICK ANYWHERE TO RETURN TO LIBRARY', canvas.width / 2, canvas.height / 2 + 120);
      
      // Draw sample enemies
      const enemyTypes = ['#8b5cf6', '#c084fc', '#d8b4fe']; // purple tones
      const enemyLabels = ['= 10 PTS', '= 20 PTS', '= 30 PTS'];
      
      for (let i = 0; i < 3; i++) {
        drawEnemy(ctx, canvas.width / 2 - 120, canvas.height / 2 + 80 + i * 40, i);
        ctx.fillStyle = '#d8b4fe'; // purple-300
        ctx.textAlign = 'left';
        ctx.fillText(enemyLabels[i], canvas.width / 2 - 70, canvas.height / 2 + 90 + i * 40);
      }
    }

    function drawGame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Draw HUD
      ctx.fillStyle = '#d8b4fe'; // purple-300
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('1UP', 50, 30);
      
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HIGH SCORE', canvas.width / 2, 30);
      
      ctx.fillStyle = '#f0abfc'; // pink-300
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(score.toString().padStart(4, '0'), 50, 60);
      
      ctx.textAlign = 'center';
      ctx.fillText(highScore.toString().padStart(4, '0'), canvas.width / 2, 60);
      
      // Draw player ship
      const player = playerRef.current;
      drawPlayer(ctx, player.x, player.y);
      
      // Draw player name
      ctx.fillStyle = '#c084fc'; // purple-400
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(player.name, player.x + player.width / 2, player.y - 10);
      
      // Draw lives
      for (let i = 0; i < player.lives; i++) {
        drawPlayer(ctx, 30 + i * 40, canvas.height - 40, 0.7);
      }
      
      // Draw player bullets
      ctx.fillStyle = '#a855f7'; // purple-500
      for (const bullet of bulletsRef.current) {
        // Bullet with glow effect
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 8;
        ctx.fillRect(bullet.x, bullet.y, 4, 10);
        ctx.shadowBlur = 0;
      }
      
      // Draw enemy bullets
      ctx.fillStyle = '#f0abfc'; // pink-300
      for (const bullet of enemyBulletsRef.current) {
        ctx.shadowColor = '#f0abfc';
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
      ctx.fillStyle = '#a855f7'; // purple-500
      
      // Add glow effect for player ship
      ctx.shadowColor = '#c084fc';
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
      ctx.fillStyle = '#c084fc'; // purple-400
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
      
      ctx.fillStyle = '#d8b4fe'; // purple-300
      ctx.font = `bold 40px ${pressStart2P.style.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(gameWon ? 'YOU WIN!' : 'GAME OVER', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '20px monospace';
      ctx.fillStyle = '#c084fc'; // purple-400
      ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
      
      // Add token award status
      if (gameWon) {
        ctx.fillStyle = tokenMinted ? '#a78bfa' : '#f0abfc'; // purple-400 if minted, pink-300 if not
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
  }, [gameStarted, gameOver, gameWon, highScore, publicKey, tokenMinted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
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
          className="text-purple-300 hover:text-purple-200 transition-colors font-medium"
        >
          ← Back to Game Library
        </Link>
      </div>
    </div>
  );
}
