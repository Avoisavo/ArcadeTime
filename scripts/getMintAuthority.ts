import { Keypair } from '@solana/web3.js';

// Store the mint authority keypair in localStorage
const MINT_AUTHORITY_KEY = 'arcade_token_mint_authority';

export function getMintAuthority(): Keypair {
  try {
    // Try to get existing mint authority from localStorage
    const storedKeypair = localStorage.getItem(MINT_AUTHORITY_KEY);
    if (storedKeypair) {
      const secretKey = Uint8Array.from(JSON.parse(storedKeypair));
      return Keypair.fromSecretKey(secretKey);
    }
  } catch (error) {
    console.warn('Error loading mint authority from storage:', error);
  }

  // If no stored keypair or error, generate new one
  const newKeypair = Keypair.generate();
  try {
    // Store the new keypair
    localStorage.setItem(MINT_AUTHORITY_KEY, JSON.stringify(Array.from(newKeypair.secretKey)));
  } catch (error) {
    console.warn('Error storing mint authority:', error);
  }
  return newKeypair;
}

// Get the mint authority and log its address
const mintAuthority = getMintAuthority();
console.log('Mint Authority Address:', mintAuthority.publicKey.toBase58()); 