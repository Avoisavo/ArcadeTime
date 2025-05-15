# Arcade Time
![System File Structure](/public/arcadetime.png)

Arcade Time is a gaming platform built on Solana, where each game features its own unique assets, and all games share a single unified token. The token is tradable, swappable, and usable across all games. Additionally, game-specific assets can be easily transferred or swapped between games, allowing for a truly interconnected gaming experience. Users can play, earn, swap, and trade across the entire platform seamlessly.

Key Highlights:

- Each game asstes can swap to other game that available in the platform

- Tokens can be swapped to SOL and vice versa.

- Peer-to-peer marketplace to buy and sell game assets.


# Inspiration: How It All Started

This project was inspired by our own gaming experiences. We were passionate Valorant players who eventually moved on to CS:GO, only to realize that everything we had invested like expensive skins and character skins couldn't carry over. The same frustration applied to other games too. In GTA IV, all the achievements we earned and the custom car designs we created couldn't be transferred to GTA V. We could only revisit those memories by going back to the older game.
That frustration sparked the idea for Arcade Time, a platform where digital assets and in-game currencies can move freely across multiple games within the same ecosystem. With a unified token used across all games, players don't have to worry about their money being locked into a single title. Assets are also transferable and when they move, the player's in-game status moves too. For example, if someone is a pro in one game, switching their assets to another will reflect that experience, instantly recognizing them as a skilled player.
In short, the desire for continuity, recognition, and retained value across games became the core inspiration behind Arcade Time.

# The Problem:

In traditional gaming ecosystems, assets and currencies are confined to individual games. Players can't transfer skins, achievements, or in-game items to other titles. Once they move on to a new game, their previous investments become useless or forgotten.

# The Solution

Arcade Time creates a unified ecosystem where game assets and in-game currencies can be transferred and reused across multiple games on the platform. This ensures that players' digital investments retain their value, offering greater flexibility, continuity, and long-term utility.

# How It Works

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


![System File Structure](/public/systemarchitecture.png)
*Figure 1: Arcade Time system arcitecture*


Users can access Arcade Time by connecting their Phantom wallet. From there, they can choose any game on the platform to play and earn rewards. When they win, the game drops both tokens and items — tokens are sent directly to their wallet, while game assets are minted as NFTs via Metaplex and linked to the wallet. Users can then swap tokens for SOL, trade items, or transfer assets between games within the platform. If they have extra items, they can list them for sale in our built-in P2P marketplace.

# Tech Stack Overview

- **Frontend:** Next.js 15  
- **Language:** TypeScript  
- **Blockchain:** Solana  
- **UI:** Tailwind CSS  

Wallet Integration:

- `@solana/wallet-adapter-react`  
- `@solana/wallet-adapter-react-ui`  
- `@solana/wallet-adapter-wallets`  

Solana Libraries:

- `@solana/web3.js`  
- `@solana/spl-token`



📂 Important Code Directories

![System File Structure](/public/systemfile.png)

*Figure 2: Arcade Time directory structure overview*



# Features

🎮 Multi-Game Asset Portability

Seamlessly transfer in-game assets between supported games like Tetris, Pac-Man, Stickman, Space Invaders, and Galaga.

💰 Unified Token System

All games share a single Arcade token, allowing for easy earning, spending, and swapping across titles.

🔄 Token-to-SOL Swapping

Convert earned tokens to SOL and vice versa, giving real-world value to in-game achievements.

🛒 Decentralized Marketplace

Buy, sell, or trade game assets directly with other players using game tokens or legacy tokens.

🔐 Wallet-Based Authentication

Secure user login through Phantom wallet integration.

🎯 Smart Inventory System
Switch assets between games with an intuitive inventory system — assets auto-update in-game after switching.

# Getting Started

Make sure you have the following installed on your machine:
- [Node.js (Latest LTS)](https://nodejs.org/)  or [Yarn](https://yarnpkg.com/)  
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/stickman-arcade.git
   cd stickman-arcade
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using Yarn:
   ```bash
   yarn install
   ```

3. **Environment Setup**

   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   Open `.env.local` and add your Solana configuration:
   ```env
   # .env.local
   SOLANA_NETWORK=devnet
   ANCHOR_WALLET=~/.config/solana/id.json
   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
   # any other keys your dApp requires...
   ```

3. **Development**

   Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000).

---


🎯 Available Games

- **Stickman**  
- **Space Invaders**  
- **Pac-Man**  
- **Galaga**  
- **Tetris**  

💰 Token Integration

- **Earn unique tokens** per game  
- **Convert tokens ↔ SOL** seamlessly  
- **Legacy token system** for retired titles  
- **Full token utility** in marketplace & in-game purchases  


# How We Are Different

Most gaming platforms isolate each game’s economy, locking players’ progress and purchases within a single title. Arcade Time breaks that barrier by introducing:

🔁 Asset and Progress Continuity

Game assets and player experience move across games, ensuring nothing is lost when switching titles.

🧠 Skill Recognition Across Games

If you're skilled in one game, the platform recognizes it in another — adapting your starting state accordingly.

🪙 Flexible Game Economies

Each game shared token and exists within a unified economy, allowing cross-game and SOL interaction.



# Future Plans

🕹️ Add More Games:
Expand the Arcade Time library with more retro and indie titles.

🏆 Cross-Game Leaderboards:
Introduce global and game-specific leaderboards to reward top players across the platform.

📱 Mobile Platform Integration:
Bring Arcade Time to mobile devices for on-the-go play and asset management.

⚙️ Developer SDK & Game Onboarding:
Provide tools for developers to integrate their own games into the Arcade Time ecosystem.

# Team

Tan Zhi Wei (Leader)
– Full Stack Developer
- [LinkedIn](https://www.linkedin.com/in/tanzhiwei0328/)

Phen Jing Yuan  
– Back End Developer and Smart Contract Engineer
- [LinkedIn](https://www.linkedin.com/in/jing-yuan-phen-b42266295/)
