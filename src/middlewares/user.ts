import { Request, Response, NextFunction } from 'express';

export const walletAddressAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-wallet-address'];

  if (!userId) return res.status(401).json({ error: 'ID is missing' });

  next();
};
