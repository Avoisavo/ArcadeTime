# Arcade Time
Arcade Time is a blockchain-powered gaming platform where each game has its own unique token—unlike traditional platforms where a single token is shared across all games. Users can play, earn, swap, and trade tokens tied specifically to games like Tetris, Pac-Man, Stickman, Space Invaders, and Galaga.
Key Highlights:
Each game has a dedicated token.
Tokens can be swapped to SOL and vice versa.
Peer-to-peer marketplace to buy and sell game assets.
Legacy token system for retired games, ensuring asset value continuity.


# Inspiration: How It All Started

This project was inspired by our team member Zhi Wei’s personal gaming experience. She was a passionate Valorant player who later transitioned to CS:GO, only to realize her time and money spent in Valorant could not carry over. This sparked the idea for Arcade Time — a platform where digital assets and in-game currencies can transition across multiple games within the same ecosystem.


# The Problem

In most gaming ecosystems, game assets are locked within individual games and cannot be transferred or reused across titles.

# The Solution

Arcade Time enables game assets and in-game currencies to be swapped across games within the platform, making digital investments more flexible and long-lasting.

#⚙ How It Works

👜 Wallet Connection
Users connect their Phantom wallet to access the platform.
🕹️ Game Interaction
Users can choose from multiple games: Tetris, Pac-Man, Stickman, Space Invaders, and Galaga.
💰 Token Mechanics
Each game issues its own unique token.
Users earn tokens by playing.
Tokens can be swapped with SOL or used to buy in-game assets.
When a game is retired (e.g., Pac-Man is taken down), its tokens are automatically converted to a "legacy token", which can:
Be used across the platform
Be swapped to SOL or other game tokens
Not be purchased using SOL or other game tokens
🛒 Marketplace
Fully peer-to-peer asset trading
Buy/sell using game tokens or legacy tokens
Users lacking game tokens can swap SOL to arcade tokens to purchase assets

#System Architecture Overview

Arcade Time is built on the Solana blockchain with wallet-based authentication and decentralized token storage. Upon connecting their wallet, users can play games, earn game-specific tokens, and receive in-game asset drops, which are either minted to their wallet or stored for later use. These tokens can be swapped via an exchange system, and a P2P marketplace enables the trading of game assets and inventory. The architecture supports seamless token flow, enabling a full play-to-earn experience with asset portability and legacy support.

# Tech Stack Overview

Frontend: Next.js 15
Language: TypeScript
Blockchain: Solana
UI: Tailwind CSS
Wallet Integration:
@solana/wallet-adapter-react
@solana/wallet-adapter-react-ui
@solana/wallet-adapter-wallets
Solana Libraries:
@solana/web3.js
@solana/spl-token
📂 Important Code Directories

├── app/                    # Next.js app directory
│   ├── games/              # Game components
│   ├── inventory/          # Player inventory
│   ├── library/            # Game library
│   ├── marketplace/        # Asset marketplace
│   └── spaceinvaders/      # Space Invaders game
├── components/             # Reusable UI components
├── contract/               # Smart contract code
├── public/                 # Static assets
├── scripts/                # Utility scripts
└── utils/                  # Helper functions

# Features

Multiple classic arcade games
Game-specific SPL tokens
Solana blockchain integration
Wallet-based user authentication
Real-time asset marketplace
Intuitive UI with Tailwind CSS

# Getting Started

Prerequisites
Node.js (Latest LTS)
npm or yarn
Solana CLI
Installation
Clone the repository:
git clone [your-repo-url]
cd stickman-arcade
Install dependencies:
npm install
or
yarn install
Set up your environment:
Create a .env.local file in the root directory
Add necessary Solana configs
Start the dev server:
npm run dev
 or
yarn dev
Visit http://localhost:3000 to view the app.

🎯 Available Games

Stickman
Space Invaders
Pac-Man
Galaga
Tetris

💰 Token Integration

Earn unique tokens per game
Convert tokens to SOL and vice versa
Legacy token system for retired games
Full token utility in marketplace and in-game purchases

🔧 Development Scripts

npm run dev – Start dev server
npm run build – Build for production
npm run start – Run production server
npm run create-token – Create new SPL token

# How We Are Different

Unlike traditional game platforms that share a single currency, Arcade Time gives each game its own economy while offering flexibility and utility via legacy tokens and swap mechanisms. This model ensures assets retain value even after a game is removed from the platform.

# Future Plans

Expand game catalog
Introduce cross-platform leaderboard
Mobile version support
NFT-based asset skins

# Team

Tan Zhi Wei – Full Stack Developer
