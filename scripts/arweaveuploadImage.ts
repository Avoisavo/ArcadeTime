import { Connection, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from '@metaplex-foundation/js';
import * as fs from 'fs';
import path from 'path';

// Load your keypair from the wallet-keypair.json file
const keypairFile = fs.readFileSync('./wallet-keypair.json', 'utf-8');
const keypair = Keypair.fromSecretKey(
  Buffer.from(JSON.parse(keypairFile))
);

// Initialize connection to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair))
  .use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: 'https://api.devnet.solana.com',
    timeout: 60000,
  }));

async function uploadImage() {
  try {
    const imagePath = path.join(__dirname, '../metastick.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const metaplexFile = toMetaplexFile(imageBuffer, 'metastick.png');

    console.log('Uploading image to Arweave via Bundlr...');
    const { uri } = await metaplex.nfts().uploadMetadata({
      name: 'Stickman Arcade Token Image',
      image: metaplexFile,
    });
    console.log('Image uploaded! Arweave URL:', uri);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

uploadImage(); 