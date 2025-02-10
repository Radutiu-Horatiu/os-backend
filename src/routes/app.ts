import { Router } from 'express';

import { scenes } from '../constants/scenes';
import { avatars } from '../constants/avatars';

const routes = Router();

/**
 * @swagger
 * /app/assets:
 *   get:
 *     summary: Retrieve assets
 *     tags: [App]
 *     responses:
 *       200:
 *         description: Assets
 *       500:
 *         description: Sorry, something went wrong :/
 */
routes.get('/assets', async (_, res) => {
  try {
    res.json({ scenes, avatars });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default routes;
