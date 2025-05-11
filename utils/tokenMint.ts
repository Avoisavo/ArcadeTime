import { Connection, clusterApiUrl, Keypair, PublicKey, Commitment } from '@solana/web3.js';
import { StickManToken } from '../contract/StickManToken';

// Initialize connection to Solana network (using devnet for development)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed' as Commitment);

// Create a new keypair for the mint authority (in production, this should be stored securely)
const mintAuthority = Keypair.generate();

// Initialize the StickMan token
const stickManToken = new StickManToken(connection, mintAuthority);

// Store the mint address
let mintAddress: PublicKey | null = null;

export async function initializeToken() {
  try {
    if (!mintAddress) {
      console.log('Initializing token...');
      mintAddress = await stickManToken.createToken();
      console.log('Token created with address:', mintAddress.toBase58());
    }
    return mintAddress;
  } catch (error) {
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
    const signature = await stickManToken.mintTokenToUser(new PublicKey(userWallet));
    console.log('Token minted successfully. Transaction signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error minting token:', error);
    throw error;
  }
} 