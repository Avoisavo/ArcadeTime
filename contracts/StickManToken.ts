import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
} from '@solana/spl-token';

// Use the actual Stickman token address
const DEFAULT_MINT_ADDRESS = '93tNUa4YRQ5BWX1PSg3tSbZV162YsDKGLhuZeThVLbdu';

// Use Solana's official devnet RPC for airdrops
const AIRDROP_RPC_URL = clusterApiUrl('devnet');

export class StickManToken {
  private connection: Connection;
  private airdropConnection: Connection;
  private mint: PublicKey | null = null;
  private mintAuthority: Keypair;
  private lastAirdropAttempt: number = 0;
  private readonly AIRDROP_COOLDOWN = 60000; // 1 minute cooldown between airdrop attempts

  constructor(connection: Connection, mintAuthority: Keypair) {
    this.connection = connection;
    this.airdropConnection = new Connection(AIRDROP_RPC_URL);
    this.mintAuthority = mintAuthority;
    // Initialize with the default mint address
    this.mint = new PublicKey(DEFAULT_MINT_ADDRESS);
  }

  private async fundMintAuthority(): Promise<void> {
    try {
      const balance = await this.connection.getBalance(this.mintAuthority.publicKey);
      if (balance < LAMPORTS_PER_SOL) {
        const now = Date.now();
        if (now - this.lastAirdropAttempt < this.AIRDROP_COOLDOWN) {
          console.warn('Airdrop cooldown in effect, using existing balance');
          return;
        }

        try {
          this.lastAirdropAttempt = now;
          // Request airdrop using Solana's official devnet RPC
          const signature = await this.airdropConnection.requestAirdrop(
            this.mintAuthority.publicKey,
            LAMPORTS_PER_SOL
          );
          await this.airdropConnection.confirmTransaction(signature);
          console.log('Mint authority funded with 1 SOL');
        } catch (error: any) {
          if (error?.message?.includes('429') || 
              error?.message?.includes('airdrop limit reached')) {
            console.warn('Airdrop limit reached, using existing balance');
            return;
          }
          console.error('Airdrop error:', error);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking mint authority balance:', error);
      // Continue with existing balance
    }
  }

  async createToken(): Promise<PublicKey> {
    // Always return the existing mint address
    return this.mint!;
  }

  async mintTokenToUser(userWallet: PublicKey, amount: number = 1): Promise<string> {
    try {
      // Ensure mint authority is funded before proceeding
      await this.fundMintAuthority();

      // Get or create the user's token account
      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.mintAuthority,
        this.mint!,
        userWallet
      );

      // Check mint authority balance again before minting
      const balance = await this.connection.getBalance(this.mintAuthority.publicKey);
      if (balance < LAMPORTS_PER_SOL / 10) { // Ensure at least 0.1 SOL for transaction
        throw new Error('Insufficient funds in mint authority account. Please visit https://faucet.solana.com to get test SOL manually.');
      }

      // Mint tokens to the user
      const signature = await mintTo(
        this.connection,
        this.mintAuthority,
        this.mint!,
        userTokenAccount.address,
        this.mintAuthority,
        amount
      );

      return signature;
    } catch (error) {
      console.error('Error minting token to user:', error);
      throw error;
    }
  }
} 