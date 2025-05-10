import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey, Commitment } from '@solana/web3.js';
import { StickManToken } from '../../contracts/StickManToken';
import fs from 'fs';
import path from 'path';

// Initialize connection to Solana network with custom configuration
const connection = new Connection('https://api.devnet.solana.com', {
  commitment: 'confirmed' as Commitment,
  wsEndpoint: 'wss://api.devnet.solana.com/',
});

function getMintAuthority(): Keypair {
  try {
    const keypairPath = path.resolve(process.cwd(), 'wallet-keypair.json');
    if (!fs.existsSync(keypairPath)) {
      throw new Error('wallet-keypair.json not found in project root');
    }
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(keypairPath, 'utf-8')));
    return Keypair.fromSecretKey(secretKey);
  } catch (error: any) {
    console.error('Error reading wallet keypair:', error);
    throw new Error('Failed to read wallet keypair: ' + error.message);
  }
}

// Create a new keypair for the mint authority
let mintAuthority: Keypair;
let stickManToken: StickManToken;

try {
  mintAuthority = getMintAuthority();
  stickManToken = new StickManToken(connection, mintAuthority);
} catch (error: any) {
  console.error('Error initializing StickMan token:', error);
  // Don't throw here, we'll handle it in the API route
}

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
      const isRateLimit = error?.message?.includes('429') || 
                         error?.message?.includes('Too Many Requests') ||
                         error?.message?.includes('rate limit');

      if (retries >= maxRetries || !isRateLimit) {
        throw error;
      }
      
      const jitter = Math.random() * 1000;
      const backoffDelay = delay + jitter;
      
      console.log(`Rate limited, retrying in ${Math.round(backoffDelay)}ms... (Attempt ${retries + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      delay = Math.min(delay * 2, 30000);
      retries++;
    }
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if StickMan token is properly initialized
    if (!stickManToken) {
      return res.status(500).json({ error: 'StickMan token not properly initialized. Check server logs for details.' });
    }

    const { action, userWallet, amount } = req.body;

    if (action === 'initialize') {
      if (!mintAddress) {
        console.log('Initializing token...');
        try {
          mintAddress = await retryWithBackoff(() => stickManToken.createToken());
          console.log('Token created with address:', mintAddress.toBase58());
        } catch (error: any) {
          if (error?.message?.includes('airdrop limit reached') || 
              error?.message?.includes('Testnet airdrop limit reached')) {
            console.log('Airdrop limit reached, using default mint address...');
            mintAddress = new PublicKey('EYn3Xp9ut4wLyvPSCFgnri7NzK5PHtoJAN2W2sippuoL');
          } else {
            throw error;
          }
        }
      }
      return res.status(200).json({ mintAddress: mintAddress.toBase58() });
    }

    if (action === 'mint') {
      if (!mintAddress) {
        console.log('Token not initialized, initializing now...');
        try {
          mintAddress = await retryWithBackoff(() => stickManToken.createToken());
        } catch (error: any) {
          if (error?.message?.includes('airdrop limit reached') || 
              error?.message?.includes('Testnet airdrop limit reached')) {
            console.log('Airdrop limit reached, using default mint address...');
            mintAddress = new PublicKey('EYn3Xp9ut4wLyvPSCFgnri7NzK5PHtoJAN2W2sippuoL');
          } else {
            throw error;
          }
        }
      }
      
      console.log('Minting token to wallet:', userWallet);
      const signature = await retryWithBackoff(() => 
        stickManToken.mintTokenToUser(new PublicKey(userWallet), amount || 1)
      );
      return res.status(200).json({ signature });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('Error in StickMan token API:', error);
    return res.status(500).json({ 
      error: error.message || 'An unexpected error occurred',
      details: error.toString()
    });
  }
} 