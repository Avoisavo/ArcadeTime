import { 
  generateSigner
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore, create } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createSignerFromWalletAdapter } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { signerIdentity } from "@metaplex-foundation/umi";
import type { WalletContextState } from '@solana/wallet-adapter-react';

// Fixed metadata URI for all NFTs
const FIXED_METADATA_URI = "https://ipfs.filebase.io/ipfs/Qmbvv92c7KvVtUtmB161XzPjyPe1BxnjNpXejgMHuSrcK9";

// The wallet adapter utility function
const createUmiWithWalletAdapter = (umi: any, wallet: WalletContextState) => {
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error('Wallet not connected or does not support required signing methods');
  }

  // Create a signer from the wallet adapter
  const signer = createSignerFromWalletAdapter(wallet);
  
  // Use the signer as the identity
  return umi.use(signerIdentity(signer));
};

// Create NFT using Metaplex Core with fixed metadata URI
export const mintNFT = async (
  wallet: WalletContextState,
  onStatusUpdate: (status: string) => void
) => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  onStatusUpdate("Starting NFT minting process...");
  console.log("Starting NFT minting process...");

  try {
    // Initialize Umi with Metaplex Core
    onStatusUpdate("Initializing Solana connection...");
    
    const umi = createUmi("https://api.devnet.solana.com")
      .use(mplCore());
    
    try {
      // Use our utility function to set up wallet adapter as signer
      createUmiWithWalletAdapter(umi, wallet);
    } catch (err) {
      console.error("Error setting up wallet adapter:", err);
      throw new Error("Failed to set up wallet with Metaplex: " + (err instanceof Error ? err.message : String(err)));
    }
    
    // Generate a signer for the asset
    const asset = generateSigner(umi);
    console.log("Generated asset address:", asset.publicKey);
    onStatusUpdate(`Generated asset address: ${asset.publicKey}`);
    
    // Create NFT using the fixed metadata URI
    onStatusUpdate("Creating NFT on Solana...");
    const tx = await create(umi, {
      asset,
      name: "SigmaStick NFT",
      uri: FIXED_METADATA_URI,
    }).sendAndConfirm(umi);
    
    // Get transaction signature
    const signature = base58.deserialize(tx.signature)[0];
    console.log("Transaction signature:", signature);
    
    return {
      assetAddress: asset.publicKey,
      signature: signature,
      metadataUri: FIXED_METADATA_URI
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}; 