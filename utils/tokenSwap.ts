import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

export async function executeSwap(
  walletAddress: string,
  fromTokenMint: PublicKey,
  toTokenMint: PublicKey | null, // null for SOL
  amount: number,
  solAmount: number,
  wallet: WalletContextState
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const connection = new Connection(process.env.HELIUS_RPC_URL || 'https://api.devnet.solana.com');
  
  // Get the user's token account
  const fromTokenAccount = await getAssociatedTokenAddress(
    fromTokenMint,
    wallet.publicKey
  );

  // Create transaction
  const transaction = new Transaction();

  // Add transfer instruction for STICKMAN tokens
  transaction.add(
    createTransferInstruction(
      fromTokenAccount,
      new PublicKey('YOUR_PROGRAM_ADDRESS'), // Replace with your program's address that will handle the swap
      wallet.publicKey,
      amount * Math.pow(10, 9) // Convert to lamports (assuming 9 decimals)
    )
  );

  // Add SOL transfer instruction
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey('YOUR_PROGRAM_ADDRESS'), // Replace with your program's address
      toPubkey: wallet.publicKey,
      lamports: solAmount * Math.pow(10, 9) // Convert SOL to lamports
    })
  );

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  // Sign and send transaction
  const signed = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  
  // Wait for confirmation
  await connection.confirmTransaction(signature);

  return signature;
} 