import { Router } from 'express';

import { UserModel, IUser } from '../models/user';
import { generateHits } from '../utils/hits';

const routes = Router();

/**
 * @swagger
 * /user:
 *    get:
 *     summary: Retrieves one user by wallet address
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user
 */
routes.get('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];

    const user: IUser | null = await UserModel.findOne({
      walletAddress,
    }).exec();
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.hits.length < 10) {
      const newHits = generateHits(10 - user.hits.length);
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
 *  post:
 *    summary: Create a new user
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: User created
 *      400:
 *        description: User already exists
 *      500:
 *        description: Sorry, something went wrong :/
 */
routes.post('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];

    const user: IUser | null = await UserModel.findOne({
      walletAddress,
    }).exec();

    if (user) return res.status(400).json({ error: 'User already exists' });

    const newUser = new UserModel({ walletAddress, hits: generateHits(10) });

    await newUser.save();

    return res.json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default routes;
