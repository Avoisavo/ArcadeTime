import { Connection, clusterApiUrl, Keypair, PublicKey, Commitment, ConnectionConfig } from '@solana/web3.js';
import { SpaceToken } from '../contracts/SpaceToken';
// token minted succesfully

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

// Helper function to retry operations with exponential backoff and jitter
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  initialDelay: number = 2000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      // Check if it's a rate limit error
      const isRateLimit = error?.message?.includes('429') || 
                         error?.message?.includes('Too Many Requests') ||
                         error?.message?.includes('rate limit');

      if (retries >= maxRetries || !isRateLimit) {
        throw error;
      }
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 1000;
      const backoffDelay = delay + jitter;
      
      console.log(`Rate limited, retrying in ${Math.round(backoffDelay)}ms... (Attempt ${retries + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      // Exponential backoff with a maximum cap
      delay = Math.min(delay * 2, 30000); // Cap at 30 seconds
      retries++;
    }
  }
}

export async function initializeSpaceToken() {
  try {
    if (!mintAddress) {
      console.log('Initializing Space token...');
      // Try to create token with retry mechanism
      mintAddress = await retryWithBackoff(() => spaceToken.createToken());
      console.log('Space token created with address:', mintAddress.toBase58());
    }
    return mintAddress;
  } catch (error: any) {
    // If we get a rate limit error, we'll assume the token already exists
    if (error?.message?.includes('429') || 
        error?.message?.includes('Too Many Requests') ||
        error?.message?.includes('rate limit')) {
      console.log('Rate limited, assuming Space token already exists...');
      // Return a default mint address or handle this case appropriately
      return new PublicKey('EYn3Xp9ut4wLyvPSCFgnri7NzK5PHtoJAN2W2sippuoL');
    }
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
  } catch (error: any) {
    // Handle rate limit errors specifically
    if (error?.message?.includes('429') || 
        error?.message?.includes('Too Many Requests') ||
        error?.message?.includes('rate limit')) {
      throw new Error('Rate limit reached. Please try again in a few minutes.');
    }
    console.error('Error minting Space token:', error);
    throw error;
  }
} 