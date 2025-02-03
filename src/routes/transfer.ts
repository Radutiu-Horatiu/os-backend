import { Router } from 'express';
import { v4 as uuid } from 'uuid';

import { UserModel } from '../models/user';
import { sendTokens } from '../utils/token';
import { TransferModel, ITransfer } from '../models/transfer';

const routes = Router();

/**
 * @swagger
 * /transfer:
 *   post:
 *     summary: Transfer tokens to users
 *     tags: [Transfers]
 *     responses:
 *       200:
 *         description: Transactions processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions processed successfully
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the transaction
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The creation date of the transaction
 *                       amount:
 *                         type: number
 *                         description: The amount of tokens transferred
 *                       address:
 *                         type: string
 *                         description: The wallet address of the user
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No users found
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
routes.post('/', async (_, res) => {
  try {
    const users = await UserModel.find({
      unclaimedPoints: { $gt: 10000 },
    }).exec();

    if (!users.length)
      return res.status(404).json({ error: 'No users found.' });

    const transactions: ITransfer[] = users.map(
      (user) =>
        new TransferModel({
          id: uuid(),
          amount: user.unclaimedPoints,
          address: user.walletAddress,
        })
    );

    await sendTokens(transactions);

    await TransferModel.insertMany(transactions);

    // Update users' claimedPoints and unclaimedPoints
    for (const user of users) {
      user.claimedPoints += user.unclaimedPoints;
      user.unclaimedPoints = 0;
      await user.save();
    }

    return res.json({
      message: 'Transactions processed successfully',
      transactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default routes;
