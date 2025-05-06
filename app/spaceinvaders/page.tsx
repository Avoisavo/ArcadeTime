"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(2010);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

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
      let type = 0; // Blue enemies (bottom rows)
      if (row === 0) type = 2; // Yellow enemies (top row)
      else if (row === 1) type = 1; // Purple enemies (middle row)
      
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
      
      // Draw
      drawGame(ctx, canvas);
      
      if (gameOver || gameWon) {
        drawGameEnd(ctx, canvas);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    function drawStars(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      ctx.fillStyle = 'white';
      
      // Draw random stars
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(i * 0.1 + Date.now() * 0.0005) + 1) * canvas.width/2;
        const y = (Math.cos(i * 0.13 + Date.now() * 0.0003) + 1) * canvas.height/2;
        const size = (Math.sin(i * 0.5 + Date.now() * 0.001) + 1) * 1.5;
        
        ctx.fillRect(x, y, size, size);
      }
    }

    function drawTitleScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      drawStars(ctx, canvas);
      
      // Title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 40px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SPACE INVADERS', canvas.width / 2, canvas.height / 3);
      
      // Instructions
      ctx.font = '20px monospace';
      ctx.fillText('PRESS ENTER TO START', canvas.width / 2, canvas.height / 2);
      ctx.fillText('ARROW KEYS TO MOVE, SPACE TO SHOOT', canvas.width / 2, canvas.height / 2 + 40);
      
      // Draw sample enemies
      const enemyTypes = ['#50a0ff', '#a050ff', '#ffff00'];
      const enemyLabels = ['= 10 PTS', '= 20 PTS', '= 30 PTS'];
      
      for (let i = 0; i < 3; i++) {
        drawEnemy(ctx, canvas.width / 2 - 120, canvas.height / 2 + 80 + i * 40, i);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText(enemyLabels[i], canvas.width / 2 - 70, canvas.height / 2 + 90 + i * 40);
      }
    }

    function drawGame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Draw HUD
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('1UP', 50, 30);
      
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HIGH SCORE', canvas.width / 2, 30);
      
      ctx.fillStyle = 'red';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(score.toString().padStart(4, '0'), 50, 60);
      
      ctx.textAlign = 'center';
      ctx.fillText(highScore.toString().padStart(4, '0'), canvas.width / 2, 60);
      
      // Draw player ship
      const player = playerRef.current;
      drawPlayer(ctx, player.x, player.y);
      
      // Draw player name
      ctx.fillStyle = '#50ffff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(player.name, player.x + player.width / 2, player.y - 10);
      
      // Draw lives
      for (let i = 0; i < player.lives; i++) {
        drawPlayer(ctx, 30 + i * 40, canvas.height - 40, 0.7);
      }
      
      // Draw player bullets
      ctx.fillStyle = 'white';
      for (const bullet of bulletsRef.current) {
        ctx.fillRect(bullet.x, bullet.y, 4, 10);
      }
      
      // Draw enemy bullets
      ctx.fillStyle = '#ff5050';
      for (const bullet of enemyBulletsRef.current) {
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
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
      ctx.fillStyle = '#50ffff';
      
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
      ctx.fillStyle = '#2080ff';
      ctx.fillRect(x + 20 * scale, y, 10 * scale, 7 * scale);
    }

    function drawEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, type: number) {
      const enemyTypes = ['#50a0ff', '#a050ff', '#ffff00'];
      ctx.fillStyle = enemyTypes[type];
      
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
      ctx.fillStyle = 'white';
      ctx.fillRect(x - 5, y - 5, 10, 5);
    }

    function drawGameEnd(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      // Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 40px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(gameWon ? 'YOU WIN!' : 'GAME OVER', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '20px monospace';
      ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
      ctx.fillText('PRESS ENTER TO PLAY AGAIN', canvas.width / 2, canvas.height / 2 + 100);
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, gameWon, highScore]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black py-8">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="border-4 border-gray-800 rounded-lg shadow-lg"
        />
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
