import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { initializeSpaceToken } from './spaceTokenMint';
import { initializeToken } from './tokenMint';

const connection = new Connection('https://api.solana.devnet', 'confirmed');

export interface TokenBalance {
  symbol: string;
  balance: number;
}

export async function getUserTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  try {
    const userPublicKey = new PublicKey(walletAddress);
    const balances: TokenBalance[] = [];

    // Get Space Token balance
    try {
      const spaceTokenMint = await initializeSpaceToken();
      if (spaceTokenMint) {
        const spaceTokenAccount = await getAssociatedTokenAddress(
          spaceTokenMint,
          userPublicKey
        );
        try {
          const account = await getAccount(connection, spaceTokenAccount);
          balances.push({
            symbol: 'SPACE',
            balance: Number(account.amount)
          });
        } catch (error) {
          // Account doesn't exist yet, balance is 0
          balances.push({
            symbol: 'SPACE',
            balance: 0
          });
        }
      }
    } catch (error) {
      console.warn('Error getting Space token balance:', error);
      balances.push({
        symbol: 'SPACE',
        balance: 0
      });
    }

    // Get Stickman Token balance
    try {
      const stickmanTokenMint = await initializeToken();
      if (stickmanTokenMint) {
        const stickmanTokenAccount = await getAssociatedTokenAddress(
          stickmanTokenMint,
          userPublicKey
        );
        try {
          const account = await getAccount(connection, stickmanTokenAccount);
          balances.push({
            symbol: 'STICKMAN',
            balance: Number(account.amount)
          });
        } catch (error) {
          // Account doesn't exist yet, balance is 0
          balances.push({
            symbol: 'STICKMAN',
            balance: 0
          });
        }
      }
    } catch (error) {
      console.warn('Error getting Stickman token balance:', error);
      balances.push({
        symbol: 'STICKMAN',
        balance: 0
      });
    }

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