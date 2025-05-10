import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { initializeSpaceToken } from './spaceTokenMint';
import { initializeToken } from './tokenMint';

const RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL as string;
const connection = new Connection(RPC_URL, 'confirmed');

export interface TokenBalance {
  symbol: string;
  balance: number;
}

// Helper function to handle RPC rate limits with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      if (error?.message?.includes('429') && retries < maxRetries) {
        console.log(`Rate limited. Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        retries++;
        continue;
      }
      throw error;
    }
  }
}

export async function getUserTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  try {
    const userPublicKey = new PublicKey(walletAddress);
    const balances: TokenBalance[] = [];
    let spaceBalance = 0;
    let stickmanBalance = 0;

    // Get Space Token balance
    try {
      const spaceTokenMint = await retryWithBackoff(() => initializeSpaceToken());
      if (spaceTokenMint) {
        const spaceTokenAccount = await retryWithBackoff(() => 
          getAssociatedTokenAddress(spaceTokenMint, userPublicKey)
        );
        try {
          const account = await retryWithBackoff(() => 
            getAccount(connection, spaceTokenAccount)
          );
          spaceBalance = Number(account.amount);
        } catch (error) {
          // Account doesn't exist yet, balance is 0
          spaceBalance = 0;
        }
      }
    } catch (error) {
      console.warn('Error getting Space token balance:', error);
      spaceBalance = 0;
    }

    // Get Stickman Token balance
    try {
      const stickmanTokenMint = await retryWithBackoff(() => initializeToken());
      if (stickmanTokenMint) {
        const stickmanTokenAccount = await retryWithBackoff(() => 
          getAssociatedTokenAddress(stickmanTokenMint, userPublicKey)
        );
        try {
          const account = await retryWithBackoff(() => 
            getAccount(connection, stickmanTokenAccount)
          );
          stickmanBalance = Number(account.amount);
        } catch (error) {
          // Account doesn't exist yet, balance is 0
          stickmanBalance = 0;
        }
      }
    } catch (error) {
      console.warn('Error getting Stickman token balance:', error);
      stickmanBalance = 0;
    }

    // Add both balances to the result array
    balances.push({ symbol: 'SPACE', balance: spaceBalance });
    balances.push({ symbol: 'STICKMAN', balance: stickmanBalance });

    return balances;
  } catch (error) {
    console.error('Error getting token balances:', error);
    // Return empty balances instead of throwing
    return [
      { symbol: 'SPACE', balance: 0 },
      { symbol: 'STICKMAN', balance: 0 }
    ];
  }
} 