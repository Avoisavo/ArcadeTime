import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { getMintAuthority } from './getMintAuthority';

async function fundMintAuthority() {
  // Connect to devnet
  const connection = new Connection(process.env.HELIUS_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');
  
  // Get the mint authority
  const mintAuthority = getMintAuthority();
  const mintAuthorityAddress = mintAuthority.publicKey.toBase58();
  
  // Get your wallet (you'll need to replace this with your actual wallet)
  // For testing, you can use a new keypair
  const yourWallet = Keypair.generate();
  
  // Request airdrop for your wallet
  console.log('Requesting airdrop for your wallet...');
  const airdropSignature = await connection.requestAirdrop(
    yourWallet.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature);
  console.log('Airdrop received!');
  
  // Send SOL to mint authority
  console.log(`Sending 0.5 SOL to mint authority: ${mintAuthorityAddress}`);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: yourWallet.publicKey,
      toPubkey: mintAuthority.publicKey,
      lamports: LAMPORTS_PER_SOL / 2, // Send 0.5 SOL
    })
  );
  
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [yourWallet]
  );
  
  console.log('Transaction successful!');
  console.log('Signature:', signature);
  console.log('Mint authority balance:', await connection.getBalance(mintAuthority.publicKey) / LAMPORTS_PER_SOL, 'SOL');
}

fundMintAuthority().catch(console.error); 