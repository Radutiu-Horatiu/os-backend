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
  createBurnInstruction,
} from '@solana/spl-token';
import { createMemoInstruction } from '@solana/spl-memo';
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

const DECIMALS: number = 9;

const OWNER_PUBLIC_KEY = new PublicKey(process.env.PUBLIC_KEY as string);

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
    amount * 10 ** DECIMALS
  );

  // Create memo instruction with details
  const memoInstruction = createMemoInstruction(
    JSON.stringify({
      type: 'transfer',
      amount: amount / 10 ** DECIMALS,
    }),
    [recipient]
  );

  // Create transaction
  const transaction = new Transaction()
    .add(transferInstruction)
    .add(memoInstruction);

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

  // Calculate burn amount (2%)
  const burnAmount = Math.floor(amount * 0.02 * 10 ** DECIMALS);
  const transferAmount = amount * 10 ** DECIMALS - burnAmount;

  // Get sender's associated token account (ATA)
  const senderTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    senderPublicKey
  );

  // Get owner's associated token account (ATA)
  const ownerTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    OWNER_PUBLIC_KEY
  );

  const transaction = new Transaction();

  // Create transfer instruction
  const senderToOwnerInstruction = createTransferInstruction(
    senderTokenAccount,
    ownerTokenAccount,
    senderPublicKey,
    transferAmount
  );

  // Create burn instruction using SPL Token burn method
  const burnInstruction = createBurnInstruction(
    senderTokenAccount,
    TOKEN_MINT_ADDRESS,
    senderPublicKey,
    burnAmount
  );

  // Create memo instruction with purchase details
  const memoInstruction = createMemoInstruction(
    JSON.stringify({
      type: 'purchase',
      item: transferData.itemId,
      amount: transferAmount / 10 ** DECIMALS,
      burned: burnAmount / 10 ** DECIMALS,
    }),
    [senderPublicKey]
  );

  // Add transfer and burn instructions
  transaction
    .add(senderToOwnerInstruction)
    .add(burnInstruction)
    .add(memoInstruction);

  // Fetch latest blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPublicKey;

  // Serialize transaction for frontend signing
  return transaction
    .serialize({ requireAllSignatures: false })
    .toString('base64');
};

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
