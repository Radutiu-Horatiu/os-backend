import { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.API_KEY) return next();

  return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
};
