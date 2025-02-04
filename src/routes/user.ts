import { Router } from 'express';
import { v4 as uuid } from 'uuid';

import { UserModel, IUser, IHit } from '../models/user';
import { generateHits } from '../utils/hits';
import { prepareTokenTransaction } from '../utils/token';
import { ITransfer, TransferModel } from '../models/transfer';

const HITS_PER_USER: number = 20;

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

    let user: IUser | null = await UserModel.findOne({
      walletAddress,
    }).exec();

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.unclaimedPoints <= 0)
      return res.status(400).json({ error: 'No unclaimed points' });

    // prepare new transfer
    const transferId = uuid();
    const transfer: ITransfer = new TransferModel({
      id: transferId,
      address: walletAddress,
      amount: user.unclaimedPoints,
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
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress)
      return res.status(400).json({ error: 'Wallet address not provided' });

    let user: IUser | null = await UserModel.findOne({
      walletAddress,
    }).exec();

    if (!user) {
      // Create a new user if not found
      user = new UserModel({
        walletAddress,
        id: uuid(),
        hits: generateHits(HITS_PER_USER),
      });
      await user.save();
      return res.status(201).json(user);
    }

    if (user.hits.length < HITS_PER_USER) {
      const newHits = generateHits(
        HITS_PER_USER - user.hits.length,
        user.claimedPoints + user.unclaimedPoints
      );
      user.hits.push(...newHits);
      await user.save();
    }

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
    const walletAddress = req.headers['x-wallet-address'];
    const hitsToRemove: IHit[] = req.body;

    const user: IUser | null = await UserModel.findOne({
      walletAddress,
    }).exec();

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
        user.claimedPoints + user.unclaimedPoints
      );
      user.hits.push(...newHits);
    }

    user.unclaimedPoints += totalValue;

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

    if (transfer.completed)
      return res.status(400).json({ error: 'Transfer already completed' });

    // update transfer
    transfer.completed = true;
    transfer.signature = signature;
    await transfer.save();

    // update user
    user.claimedPoints += user.unclaimedPoints;
    user.unclaimedPoints = 0;
    await user.save();

    return res.status(204).json({ succes: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default routes;
