import { Router } from 'express';

import { getScenes } from '../constants/scenes';
import { getAvatars } from '../constants/avatars';
import { getCurrentSupply } from '../utils/token';

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
    const supply = await getCurrentSupply();
    const avatars = await getAvatars();
    const scenes = await getScenes();

    res.json({
      scenes,
      avatars,
      supply,
      tokenUrl: `https://solscan.io/token/${process.env.TOKEN_MINT_ADDRESS}?cluster=devnet`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Sorry, something went wrong :/' });
  }
});

export default routes;
