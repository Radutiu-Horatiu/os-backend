import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
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

// Function to send tokens to multiple addresses
export const sendTokens = async (transactions: ITransfer[]) => {
  const instructions = [];

  for (const { address, amount } of transactions) {
    const recipient = new PublicKey(address);

    // Ensure recipient has an associated token account
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

    instructions.push(transferInstruction);
  }

  // Create a single transaction with all instructions
  const transaction = new Transaction().add(...instructions);

  // Sign and send the transaction
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);

  console.log('✅ Batch Transaction Sent! Signature:', signature);
  return signature;
};
