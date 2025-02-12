import { Router } from 'express';
import { v4 as uuid } from 'uuid';

import { UserModel, IUser, IHit } from '../models/user';
import { generateHits } from '../utils/hits';
import {
  getUserWalletTokenBalance,
  prepareBuyTransaction,
  prepareTokenTransaction,
} from '../utils/token';
import { ITransfer, TransferModel } from '../models/transfer';
import { getItemById, ItemResult } from '../utils/items';

const HITS_PER_USER: number = 20;

const MAX_CLAIMABLE_POINTS: number = 1000000;

const routes = Router();

/**
 * @swagger
 * /user/claim_tokens:
 *   get:
 *     summary: Claim unclaimed tokens for a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Transaction prepared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   type: string
 *                   description: The serialized transaction
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Sorry, something went wrong :/
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Sorry, something went wrong :/
 */
routes.get('/claim_tokens', async (req, res) => {
  try {
    const walletAddress: string = req.headers['x-wallet-address'] as string;

    const [user, userWalletTokenBalance] = await Promise.all([
      UserModel.findOne({ walletAddress }).exec(),
      getUserWalletTokenBalance(walletAddress),
    ]);

    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.points <= 0)
      return res.status(400).json({ error: 'No unclaimed points.' });

    // Points limit
    if (userWalletTokenBalance > MAX_CLAIMABLE_POINTS)
      return res.status(400).json({ error: 'Points limit reached.' });

    // prepare new transfer
    const transferId = uuid();
    const transfer: ITransfer = new TransferModel({
      id: transferId,
      address: walletAddress,
      amount: user.points,
    });

    // store in db
    await transfer.save();

    // partially sign transaction and send back to user
    const serializedTx = await prepareTokenTransaction(transfer);

    res.json({ transaction: serializedTx, transferId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

/**
 * @swagger
 * /user:
 *    get:
 *     summary: Retrieves one user by wallet address or creates a new one if it doesn't exist
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user
 *       201:
 *         description: New user created
 *       400:
 *         description: Wallet address not provided
 *       500:
 *         description: Sorry, something went wrong :/
 */
routes.get('/', async (req, res) => {
  try {
    const walletAddress: string = req.headers['x-wallet-address'] as string;

    if (!walletAddress)
      return res.status(400).json({ error: 'Wallet address not provided' });

    // Find user and get token balance
    let [user, userWalletTokenBalance] = await Promise.all([
      UserModel.findOne({ walletAddress }).exec(),
      getUserWalletTokenBalance(walletAddress),
    ]);

    // Create a new user if not found
    if (!user) {
      user = new UserModel({
        walletAddress,
        id: uuid(),
        inWalletPoints: userWalletTokenBalance,
        hits: generateHits(HITS_PER_USER, userWalletTokenBalance),
      });
      await user.save();
    }

    // Generate new hits to maintain at least HITS_PER_USER hits
    if (user.hits.length < HITS_PER_USER) {
      const newHits = generateHits(
        HITS_PER_USER - user.hits.length,
        userWalletTokenBalance + user.points
      );
      user.hits.push(...newHits);
      await user.save();
    }

    // Update user points with token balance
    user.points += userWalletTokenBalance;

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

/**
 * @swagger
 * /user:
 *  put:
 *    summary: Update user's scene or avatar
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              scene:
 *                type: string
 *                description: The new scene for the user
 *              avatar:
 *                type: string
 *                description: The new avatar for the user
 *    responses:
 *      200:
 *        description: User updated
 *      404:
 *        description: User not found
 *      500:
 *        description: Sorry, something went wrong :/
 */
routes.put('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];
    const { scene, avatar } = req.body;

    const user: IUser | null = await UserModel.findOne({
      walletAddress,
    }).exec();
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (scene !== undefined) user.scene = scene;

    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

/**
 * @swagger
 * /user/hits:
 *  post:
 *    summary: User hits endpoint
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: The ID of the hit
 *                value:
 *                  type: number
 *                  description: The value of the hit
 *    responses:
 *      200:
 *        description: New user hits
 *      404:
 *        description: User not found
 *      500:
 *        description: Sorry, something went wrong :/
 */
routes.post('/hits', async (req, res) => {
  try {
    const walletAddress: string = req.headers['x-wallet-address'] as string;
    const hitsToRemove: IHit[] = req.body;

    const [user, userWalletTokenBalance] = await Promise.all([
      UserModel.findOne({ walletAddress }).exec(),
      getUserWalletTokenBalance(walletAddress),
    ]);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Calculate total value of hits to remove
    let totalValue = 0;
    hitsToRemove.forEach((hit) => {
      const index = user.hits.findIndex((userHit) => userHit.id === hit.id);
      if (index !== -1) {
        const hitValue = user.hits[index].value;

        if (hitValue !== hit.value) {
          return res.status(400).json({
            error: 'Hit value does not match the value in the database',
          });
        }

        totalValue += user.hits[index].value;

        user.hits.splice(index, 1);
      }
    });

    // Generate new hits to maintain at least HITS_PER_USER hits
    if (user.hits.length < HITS_PER_USER) {
      const newHits = generateHits(
        HITS_PER_USER - user.hits.length,
        userWalletTokenBalance + user.points
      );
      user.hits.push(...newHits);
    }

    user.points += totalValue;

    await user.save();

    return res.json(user.hits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

/**
 * @swagger
 * /user/finalize_transfer:
 *   post:
 *     summary: Finalize a transfer for a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transferId:
 *                 type: string
 *                 description: The ID of the transfer
 *               signature:
 *                 type: string
 *                 description: The signature of the transfer
 *     responses:
 *       200:
 *         description: Transfer finalized successfully
 *       404:
 *         description: User or transfer not found
 *       400:
 *         description: Transfer already completed
 *       500:
 *         description: Sorry, something went wrong :/
 */
routes.post('/finalize_transfer', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];

    const { transferId, signature } = req.body;

    if (!transferId || !signature)
      return res.status(400).json({ error: 'Missing transferId or signature' });

    const user: IUser | null = await UserModel.findOne({
      walletAddress,
    }).exec();

    if (!user) return res.status(404).json({ error: 'User not found' });

    const transfer: ITransfer | null = await TransferModel.findOne({
      id: transferId,
    }).exec();

    if (!transfer) return res.status(404).json({ error: 'Transfer not found' });

    if (transfer.signature)
      return res.status(400).json({ error: 'Transfer already completed' });

    // transferring an item
    if (transfer.itemId) {
      const item = getItemById(transfer.itemId);

      if (!item) return res.status(404).json({ error: 'Item not found' });

      const { data, type }: ItemResult = item;

      if (user[type].includes(data.id))
        return res.status(400).json({ error: 'Item already bought.' });

      // update in wallet points
      user[type].push(data.id);
      user.inWalletPoints -= transfer.amount;

      // update off chain points
      const pointsFromWalletDeduction = item.data.points - transfer.amount;
      user.points -= pointsFromWalletDeduction;
    }
    // transferring points
    else {
      user.inWalletPoints += transfer.amount;
      user.points = 0;
    }

    // update transfer
    transfer.signature = signature;

    await transfer.save();
    await user.save();

    return res.status(204).json({ succes: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

/**
 * @swagger
 * /user/buy-item:
 *   post:
 *     summary: Buy an item using points
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the item to buy
 *     responses:
 *       200:
 *         description: Item bought successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Sorry, something went wrong :/
 */
routes.post('/buy-item', async (req, res) => {
  try {
    const walletAddress: string = req.headers['x-wallet-address'] as string;

    const { itemId } = req.body;

    const [user, item] = await Promise.all([
      UserModel.findOne({ walletAddress }).exec(),
      getItemById(itemId),
    ]);

    if (!user) return res.status(400).json({ error: 'User not found.' });

    if (!item) return res.status(400).json({ error: 'Item not found.' });

    const { data, type }: ItemResult = item;

    if (user[type].includes(data.id))
      return res.status(400).json({ error: 'Item already bought.' });

    // not enough total points
    if (user.points + user.inWalletPoints <= data.points)
      return res.status(400).json({ error: 'Not enough points.' });

    // buy item with unclaimed points
    if (user.points >= data.points) {
      user.points -= data.points;
      user[type].push(data.id);
      await user.save();
      res.json({ transactionNeeded: false });
    } else {
      // calculate remaining points needed from inWalletPoints
      const remainingPoints = data.points - user.points;

      // prepare new transfer to buy with inWalletPoints
      const transferId = uuid();
      const transfer: ITransfer = new TransferModel({
        id: transferId,
        address: walletAddress,
        amount: remainingPoints,
        itemId: data.id,
      });

      // store in db
      await transfer.save();

      // partially sign transaction and send back to user
      const serializedTx = await prepareBuyTransaction(transfer);

      res.json({
        transactionNeeded: true,
        transaction: serializedTx,
        transferId,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default routes;
