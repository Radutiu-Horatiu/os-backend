import { Request, Response, NextFunction } from 'express';

export const walletAddressAuth = (req: Request, res: Response, next: NextFunction) => {
  const walletAddress = req.headers['x-wallet-address'];

  if (!walletAddress) return res.status(401).json({ error: 'Wallet address is missing' });

  next();
};
