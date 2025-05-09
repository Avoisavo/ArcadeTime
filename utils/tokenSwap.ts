import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import { mintSpaceToken } from './spaceTokenMint';
import { WalletContextState } from '@solana/wallet-adapter-react';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export async function executeSwap(
  userWallet: string,
  fromTokenMint: PublicKey,
  toTokenMint: PublicKey,
  amount: number,
  recipientAddress: string,
  wallet: WalletContextState
): Promise<string> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected or missing required functionality');
    }

    const userPublicKey = new PublicKey(userWallet);
    const recipientPublicKey = new PublicKey(recipientAddress);

    // Create token accounts
    const userFromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet as any, // Type assertion to bypass signer requirement
      fromTokenMint,
      userPublicKey,
      true,
      'confirmed',
      { commitment: 'confirmed' }
    );

    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet as any, // Type assertion to bypass signer requirement
      fromTokenMint,
      recipientPublicKey,
      true,
      'confirmed',
      { commitment: 'confirmed' }
    );

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      userFromTokenAccount.address,
      recipientTokenAccount.address,
      wallet.publicKey,
      amount
    );

    // Create and send transaction
    const transaction = new Transaction().add(transferInstruction);
    const signedTransaction = await wallet.signTransaction(transaction);
    const transferSignature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Wait for confirmation
    await connection.confirmTransaction(transferSignature);

    // Mint Space tokens to user
    const mintSignature = await mintSpaceToken(userWallet);

    return `${transferSignature},${mintSignature}`;
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
} 