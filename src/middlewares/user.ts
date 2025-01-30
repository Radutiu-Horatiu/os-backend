import { Request, Response, NextFunction } from 'express';

export const userIdAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'];

  if (!userId) return res.status(401).json({ error: 'ID is missing' });

  next();
};
