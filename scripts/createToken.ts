import { 
  Connection, 
  Keypair, 
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import * as fs from 'fs';

async function main() {
  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Generate a new keypair for the mint authority
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();
  
  // Airdrop some SOL to the mint authority for transaction fees
  console.log('Requesting airdrop for mint authority...');
  const airdropSignature = await connection.requestAirdrop(
    mintAuthority.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature);
  
  console.log('Creating token mint...');
  const mint = await createMint(
    connection,
    mintAuthority,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9 // 9 decimals
  );
  
  console.log('Token mint created:', mint.toBase58());
  
  // Save the mint address and authority keys
  const tokenInfo = {
    mintAddress: mint.toBase58(),
    mintAuthority: {
      publicKey: mintAuthority.publicKey.toBase58(),
      secretKey: Array.from(mintAuthority.secretKey)
    },
    freezeAuthority: {
      publicKey: freezeAuthority.publicKey.toBase58(),
      secretKey: Array.from(freezeAuthority.secretKey)
    }
  };
  
  fs.writeFileSync('token-info.json', JSON.stringify(tokenInfo, null, 2));
  console.log('Token info saved to token-info.json');
}

main().catch(console.error); 