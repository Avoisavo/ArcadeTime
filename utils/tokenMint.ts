import { Connection, clusterApiUrl, Keypair, PublicKey, Commitment } from '@solana/web3.js';
import { StickManToken } from '../contracts/StickManToken';
// token minted succesfully
// Initialize connection to Solana network with custom configuration
const connection = new Connection(process.env.HELIUS_RPC_URL || 'https://api.devnet.solana.com', {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
  wsEndpoint: process.env.HELIUS_RPC_URL_SOCKET || 'wss://api.devnet.solana.com/',
  httpHeaders: {
    'Content-Type': 'application/json',
  },
});

// Create a new keypair for the mint authority (in production, this should be stored securely)
const mintAuthority = Keypair.generate();

// Initialize the StickMan token
const stickManToken = new StickManToken(connection, mintAuthority);

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

export async function initializeToken() {
  try {
    if (!mintAddress) {
      console.log('Initializing token...');
      try {
        // Try to create token with retry mechanism
        mintAddress = await retryWithBackoff(() => stickManToken.createToken());
        console.log('Token created with address:', mintAddress.toBase58());
      } catch (error: any) {
        // If we get an airdrop error, return the default mint address
        if (error?.message?.includes('airdrop limit reached') || 
            error?.message?.includes('Testnet airdrop limit reached')) {
          console.log('Airdrop limit reached, using default mint address...');
          return new PublicKey('EYn3Xp9ut4wLyvPSCFgnri7NzK5PHtoJAN2W2sippuoL');
        }
        throw error;
      }
    }
    return mintAddress;
  } catch (error: any) {
    // If we get a rate limit error, we'll assume the token already exists
    if (error?.message?.includes('429') || 
        error?.message?.includes('Too Many Requests') ||
        error?.message?.includes('rate limit')) {
      console.log('Rate limited, assuming token already exists...');
      return new PublicKey('EYn3Xp9ut4wLyvPSCFgnri7NzK5PHtoJAN2W2sippuoL');
    }
    console.error('Error creating token:', error);
    throw error;
  }
}

export async function mintStickManToken(userWallet: string) {
  try {
    // Ensure token is initialized
    if (!mintAddress) {
      console.log('Token not initialized, initializing now...');
      mintAddress = await initializeToken();
    }
    
    console.log('Minting token to wallet:', userWallet);
    const signature = await retryWithBackoff(() => 
      stickManToken.mintTokenToUser(new PublicKey(userWallet))
    );
    console.log('Token minted successfully. Transaction signature:', signature);
    return signature;
  } catch (error: any) {
    // Handle rate limit errors specifically
    if (error?.message?.includes('429') || 
        error?.message?.includes('Too Many Requests') ||
        error?.message?.includes('rate limit')) {
      throw new Error('Rate limit reached. Please try again in a few minutes.');
    }
    console.error('Error minting token:', error);
    throw error;
  }
} 