const { Connection, PublicKey } = require('@solana/web3.js');
const { ArcadeToken } = require('../contracts/StickManToken');
const fs = require('fs');
const path = require('path');

// Connect to devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function main() {
  // Get wallet address from command line argument
  const walletAddress = process.argv[2];
  
  if (!walletAddress) {
    console.error('Please provide your wallet address as an argument:');
    console.error('npm run init-token -- YOUR_WALLET_ADDRESS');
    process.exit(1);
  }

  try {
    const publicKey = new PublicKey(walletAddress);
    
    // Check if the wallet has SOL
    const balance = await connection.getBalance(publicKey);
    console.log('Wallet Balance:', balance / 1e9, 'SOL');

    if (balance === 0) {
      console.error('Error: Wallet has no SOL. Please fund your wallet on devnet.');
      console.error('You can get devnet SOL from: https://solfaucet.com/');
      process.exit(1);
    }

    // Save the wallet address to .env.local
    const envContent = `NEXT_PUBLIC_WALLET_ADDRESS=${walletAddress}`;

    fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);
    console.log('\nSaved wallet address to .env.local');
    console.log('\nNow you can run the game and connect your wallet to mint tokens!');
    
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error); 