import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';
import * as fs from 'fs';

// Load your keypair from the wallet-keypair.json file
const keypairFile = fs.readFileSync('./wallet-keypair.json', 'utf-8');
const keypair = Keypair.fromSecretKey(
  Buffer.from(JSON.parse(keypairFile))
);

// Initialize connection to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Initialize Metaplex with debug logging
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair))
  .use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: 'https://api.devnet.solana.com',
    timeout: 60000,
  }));

async function createTokenMetadata(
  mintAddress: string,
  name: string,
  symbol: string,
  imageUrl: string,
  description: string
) {
  try {
    // Log wallet balance
    const balance = await connection.getBalance(keypair.publicKey);
    console.log('Wallet balance:', balance / 1e9, 'SOL');

    // Convert mint address string to PublicKey
    const mintPubkey = new PublicKey(mintAddress);
    console.log('Using mint address:', mintPubkey.toBase58());

    // Create metadata for the token
    console.log('Uploading metadata...');
    const { uri } = await metaplex
      .nfts()
      .uploadMetadata({
        name: name,
        symbol: symbol,
        description: description,
        image: imageUrl,
        attributes: [
          {
            trait_type: 'Game',
            value: 'Stickman Arcade'
          },
          {
            trait_type: 'Type',
            value: 'Reward Token'
          }
        ]
      });

    console.log('Metadata URI:', uri);

    // Create the metadata account
    console.log('Creating metadata account...');
    const { response } = await metaplex
      .nfts()
      .create({
        uri: uri,
        name: name,
        symbol: symbol,
        sellerFeeBasisPoints: 0,
        isCollection: false,
        updateAuthority: keypair,
        mintAuthority: keypair,
        tokenStandard: 0, // Fungible
      });

    console.log('Metadata created successfully!');
    console.log('Transaction signature:', response.signature);
    
    return response.signature;
  } catch (error) {
    console.error('Error creating metadata:', error);
    throw error;
  }
}

async function fetchMetadata(mintAddress: string) {
  const mint = new PublicKey(mintAddress);
  const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
  console.log(nft);
}

async function main() {
  // Replace these values with your desired metadata
  const mintAddress = '7FmyAVSUe4HyhZqH2Bq38S6aLaCL3wrE6VxgSrVEZjmd'; // Your token's mint address
  const name = 'Stickman Arcade Token';
  const symbol = 'STICK';
  const imageUrl = 'https://arweave.net/your-uploaded-image-id'; // Replace with your actual image URL
  const description = 'Reward token for Stickman Arcade game';

  console.log('Creating metadata for token:', mintAddress);
  console.log('Name:', name);
  console.log('Symbol:', symbol);
  console.log('Image URL:', imageUrl);
  console.log('Description:', description);
  console.log('----------------------------------------');

  try {
    const signature = await createTokenMetadata(
      mintAddress,
      name,
      symbol,
      imageUrl,
      description
    );
    console.log('Transaction signature:', signature);
    
    // Wait a moment for the transaction to be confirmed
    console.log('Waiting for confirmation...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Fetch and display the created metadata
    console.log('Fetching created metadata...');
    await fetchMetadata(mintAddress);
  } catch (error) {
    console.error('Failed to create metadata:', error);
  }
}

main(); 