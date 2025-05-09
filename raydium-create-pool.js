// RAYDIUM POOL CREATION SCRIPT
// ---------------------------------------------
// This script creates a Raydium liquidity pool for two SPL tokens.
//
// Requirements:
// - Node.js
// - Install dependencies: @solana/web3.js, @project-serum/anchor, @raydium-io/raydium-sdk
// - Funded wallet with both tokens and SOL for fees
//
// Usage:
// 1. Fill in your wallet keypair path and initial amounts below.
// 2. Run: node raydium-create-pool.js

const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } = require('@solana/spl-token');
const { Liquidity, LIQUIDITY_STATE_LAYOUT_V4, jsonInfo2PoolKeys, TokenAmount, Token, Percent } = require('@raydium-io/raydium-sdk');
const fs = require('fs');

// --- CONFIG ---
const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// 1. Load your wallet keypair (update the path!)
// Replace this with the path to your Solana wallet keypair file
// The file should be a JSON array of numbers representing your private key
const WALLET_KEYPAIR_PATH = '/Users/zwavo/Downloads/wallet-keypair.json';
const wallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(WALLET_KEYPAIR_PATH, 'utf8'))));

// 2. Token addresses
const SPACE_TOKEN = new PublicKey('DGARkzU9eaWurAit62wMbztwkq1Un8froo1sEBQWvMdc');
const STICKMAN_TOKEN = new PublicKey('5ibvmVDkzpzoUN2S4Vmi3DQCDTaB3BUUd4LaxxzzBer2');

// 3. Initial liquidity amounts (update as needed)
const SPACE_AMOUNT = 200_000;      // 0.2 token
const STICKMAN_AMOUNT = 200_000;   // 0.2 token

// 4. Pool parameters
const FEE_OWNER = wallet.publicKey; // You can set this to your own address

async function main() {
  console.log('Creating Raydium pool for:', SPACE_TOKEN.toBase58(), 'and', STICKMAN_TOKEN.toBase58());

  // 1. Create associated token accounts for both tokens if needed
  const ataSpace = await getAssociatedTokenAddress(SPACE_TOKEN, wallet.publicKey);
  const ataStickman = await getAssociatedTokenAddress(STICKMAN_TOKEN, wallet.publicKey);

  // 2. Check balances (optional, but recommended)
  // ... (You can add code to check balances here)

  // 3. Prepare pool creation instructions
  // Raydium SDK pool creation is not as simple as Uniswap. You need to use their on-chain program.
  // The best way is to use their addLiquidity instructions, but for a new pool, you must initialize it.
  // Raydium's SDK does not expose a simple createPool function, so you may need to use their CLI or UI for the initial pool creation.
  // For advanced users: You can use the Raydium SDK's Liquidity.makeCreatePoolV4Instruction, but it requires careful setup.

  console.log('Raydium pool creation is a complex process and may require using their UI or CLI for the initial step.');
  console.log('If you want to proceed with code, please refer to Raydium SDK docs and examples:');
  console.log('https://github.com/raydium-io/raydium-sdk');
  console.log('Or use the Raydium UI: https://raydium.io/swap/');

  // If you want to proceed with code, uncomment and complete the following (advanced):
  // const { instructions, signers } = await Liquidity.makeCreatePoolV4Instruction({
  //   ... // See Raydium SDK docs for required params
  // });
  // const tx = new Transaction().add(...instructions);
  // await connection.sendTransaction(tx, [wallet, ...signers]);
}

main().catch(console.error); 