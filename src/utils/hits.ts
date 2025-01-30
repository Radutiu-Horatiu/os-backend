import { IHit } from '../models/user';

export const generateHits = (number: number): IHit[] => {
  return Array.from({ length: number }, () => {
    const value = Math.floor(Math.random() * 1000 + 100 + 0.01);

    return {
      value,
    };
  });
};
