import { Router } from 'express';

import { UserModel, IUser } from '../models/user';

const routes = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 */
routes.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    const user: IUser | null = await UserModel.findOne({ id: userId }).exec();
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default routes;
