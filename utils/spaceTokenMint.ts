import { Connection, clusterApiUrl, Keypair, PublicKey, Commitment, ConnectionConfig } from '@solana/web3.js';
import { SpaceToken } from '../contracts/SpaceToken';

// Initialize connection to Solana network with custom configuration
const connectionConfig: ConnectionConfig = {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000, // 60 seconds
  wsEndpoint: 'wss://api.devnet.solana.com/',
  httpHeaders: {
    'Content-Type': 'application/json',
  },
};

const connection = new Connection(
  'https://api.devnet.solana.com',
  connectionConfig
);

// Store the mint authority keypair in localStorage
const MINT_AUTHORITY_KEY = 'space_token_mint_authority';

function getMintAuthority(): Keypair {
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

// Initialize the Space token with persistent mint authority
const mintAuthority = getMintAuthority();
const spaceToken = new SpaceToken(connection, mintAuthority);

// Store the mint address
let mintAddress: PublicKey | null = null;

// Helper function to retry operations with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      if (retries >= maxRetries || !error?.message?.includes('429')) {
        throw error;
      }
      
      console.log(`Rate limited, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
      retries++;
    }
  }
}

export async function initializeSpaceToken() {
  try {
    if (!mintAddress) {
      console.log('Initializing Space token...');
      mintAddress = await retryWithBackoff(() => spaceToken.createToken());
      console.log('Space token created with address:', mintAddress.toBase58());
    }
    return mintAddress;
  } catch (error) {
    console.error('Error creating Space token:', error);
    throw error;
  }
}

export async function mintSpaceToken(userWallet: string) {
  try {
    // Ensure token is initialized
    if (!mintAddress) {
      console.log('Space token not initialized, initializing now...');
      mintAddress = await initializeSpaceToken();
    }
    
    console.log('Minting Space token to wallet:', userWallet);
    const signature = await retryWithBackoff(() => 
      spaceToken.mintTokenToUser(new PublicKey(userWallet))
    );
    console.log('Space token minted successfully. Transaction signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error minting Space token:', error);
    throw error;
  }
} 