# Arcade Time
Arcade Time is a gaming platform build on solana where each game has its own unique assets and a single token is shared across all games. Users can play, earn, swap, and trade tokens tied specifically to games like Tetris, Pac-Man, Stickman, Space Invaders, and Galaga.
Key Highlights:
Each game asstes can swap to other game that available in the platform
Tokens can be swapped to SOL and vice versa.
Peer-to-peer marketplace to buy and sell game assets.


# Inspiration: How It All Started

This project was inspired by our own gaming experiences. We were passionate Valorant players who eventually moved on to CS:GO, only to realize that everything we had invested — like expensive Phantom skins and character skins — couldn't carry over. The same frustration applied to other games too. In GTA IV, all the achievements we earned and the custom car designs we created couldn't be transferred to GTA V. We could only revisit those memories by going back to the older game.
That frustration sparked the idea for Arcade Time — a platform where digital assets and in-game currencies can move freely across multiple games within the same ecosystem. With a unified token used across all games, players don't have to worry about their money being locked into a single title. Assets are also transferable — and when they move, the player's in-game status moves too. For example, if someone is a pro in one game, switching their assets to another will reflect that experience, instantly recognizing them as a skilled player.
In short, the desire for continuity, recognition, and retained value across games became the core inspiration behind Arcade Time.

# The Problem

In traditional gaming ecosystems, assets and currencies are confined to individual games. Players can't transfer skins, achievements, or in-game items to other titles — once they move on to a new game, their previous investments become useless or forgotten.

# The Solution

Arcade Time creates a unified ecosystem where game assets and in-game currencies can be transferred and reused across multiple games on the platform. This ensures that players' digital investments retain their value, offering greater flexibility, continuity, and long-term utility.

#⚙ How It Works

👜 Wallet Connection
Users connect their Phantom wallet to access the platform.

🕹️ Game Interaction
Users can choose from multiple games: Tetris, Pac-Man, Stickman, Space Invaders, and Galaga.

💰 Token Mechanics
Each game shared a unified token.
Users earn tokens and get unique game assets by playing.
Tokens can be swapped with SOL or used to buy in-game assets in marketplace.
While the game assets can be swap across the platform and can be sell on marketplace.

🎯 Inventory
store everysingle game assets.
Usser can switch assets here.
after switch the assets will dispaly in the game automatically.


🛒 Marketplace
Fully peer-to-peer asset trading
Buy/sell using game tokens or legacy tokens
Users lacking game tokens can swap SOL to arcade tokens to purchase assets

#System Architecture Overview

![System File Structure](/public/systemarchitecture.png)
*Figure 1: Arcade Time system arcitecture*


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

![System File Structure](/public/systemfile.png)

*Figure 2: Arcade Time directory structure overview*



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

