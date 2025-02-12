import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import bs58 from 'bs58';

import { ITransfer } from '../models/transfer';

// Connect to Solana Devnet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Load your wallet (payer)
const payer = Keypair.fromSecretKey(
  bs58.decode(process.env.PRIVATE_KEY as string)
);

// Token mint address
const TOKEN_MINT_ADDRESS = new PublicKey(
  process.env.TOKEN_MINT_ADDRESS as string
);

const OWNER_PUBLIC_KEY = new PublicKey(process.env.PUBLIC_KEY as string);

// Function to prepare token transaction
export const prepareTokenTransaction = async (transferData: ITransfer) => {
  const { address, amount } = transferData;

  const recipient = new PublicKey(address);

  // Get or create associated token accounts
  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    TOKEN_MINT_ADDRESS,
    payer.publicKey
  );
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    TOKEN_MINT_ADDRESS,
    recipient
  );

  // Create transfer instruction
  const transferInstruction = createTransferInstruction(
    senderTokenAccount.address,
    recipientTokenAccount.address,
    payer.publicKey,
    amount * 10 ** 9 // 9 decimals
  );

  // Create transaction
  const transaction = new Transaction().add(transferInstruction);

  // Fetch recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = recipient; // B pays the fees

  // A partially signs the transaction
  transaction.partialSign(payer);

  // Serialize transaction for frontend
  return transaction
    .serialize({ requireAllSignatures: false })
    .toString('base64');
};

export const prepareBuyTransaction = async (
  transferData: ITransfer
): Promise<string> => {
  const { amount, address } = transferData;
  const senderPublicKey = new PublicKey(address);

  // Get sender's associated token account (ATA)
  const senderTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    senderPublicKey
  );

  // Get recipient (owner's) associated token account (ATA)
  const recipientTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    OWNER_PUBLIC_KEY
  );

  // Create transfer instruction
  const transferInstruction = createTransferInstruction(
    senderTokenAccount,
    recipientTokenAccount,
    senderPublicKey,
    amount * 10 ** 9 // Adjust for token decimals
  );

  // Create transaction
  const transaction = new Transaction().add(transferInstruction);

  // Fetch latest blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPublicKey;

  // Serialize transaction for frontend signing
  return transaction
    .serialize({ requireAllSignatures: false })
    .toString('base64');
};

// Function to get user token balance
export const getUserWalletTokenBalance = async (address: string) => {
  try {
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      TOKEN_MINT_ADDRESS,
      new PublicKey(address)
    );

    const balance = await connection.getTokenAccountBalance(
      userTokenAccount.address
    );

    if (!balance?.value?.uiAmount) return 0;

    return balance.value.uiAmount;
  } catch {
    return 0;
  }
};
