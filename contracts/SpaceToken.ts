import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  sendAndConfirmTransaction,
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

export class SpaceToken {
  private connection: Connection;
  private mint: PublicKey | null = null;
  private mintAuthority: Keypair;

  constructor(connection: Connection, mintAuthority: Keypair) {
    this.connection = connection;
    this.mintAuthority = mintAuthority;
  }

  private async fundMintAuthority(): Promise<void> {
    try {
      const balance = await this.connection.getBalance(this.mintAuthority.publicKey);
      if (balance < LAMPORTS_PER_SOL) {
        try {
          // Request airdrop of 1 SOL (for testnet)
          const signature = await this.connection.requestAirdrop(
            this.mintAuthority.publicKey,
            LAMPORTS_PER_SOL
          );
          await this.connection.confirmTransaction(signature);
          console.log('Mint authority funded with 1 SOL');
        } catch (error: any) {
          if (error?.message?.includes('429')) {
            throw new Error(
              'Testnet airdrop limit reached. Please visit https://faucet.solana.com to get test SOL manually.'
            );
          }
          throw error;
        }
      }
    } catch (error) {
      console.error('Error funding mint authority:', error);
      throw error;
    }
  }

  async createToken(): Promise<PublicKey> {
    if (this.mint) {
      return this.mint;
    }

    try {
      // Fund the mint authority first
      await this.fundMintAuthority();

      // Create new token mint
      const mintRent = await getMinimumBalanceForRentExemptMint(this.connection);
      const mintAccount = Keypair.generate();
      
      const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: this.mintAuthority.publicKey,
        newAccountPubkey: mintAccount.publicKey,
        space: MINT_SIZE,
        lamports: mintRent,
        programId: TOKEN_PROGRAM_ID,
      });

      const initializeMintIx = createInitializeMintInstruction(
        mintAccount.publicKey,
        0, // 0 decimals
        this.mintAuthority.publicKey,
        this.mintAuthority.publicKey,
        TOKEN_PROGRAM_ID
      );

      const transaction = new Transaction().add(
        createMintAccountIx,
        initializeMintIx
      );

      await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.mintAuthority, mintAccount]
      );

      this.mint = mintAccount.publicKey;
      return this.mint;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  async mintTokenToUser(userWallet: PublicKey, amount: number = 1): Promise<string> {
    if (!this.mint) {
      throw new Error('Token mint not created yet. Please call createToken() first.');
    }

    try {
      // Get or create the user's token account
      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.mintAuthority,
        this.mint,
        userWallet
      );

      // Mint tokens to the user
      const signature = await mintTo(
        this.connection,
        this.mintAuthority,
        this.mint,
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