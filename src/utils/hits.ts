import { v4 as uuid } from 'uuid';

import { IHit } from '../models/user';

export const generateHits = (
  number: number,
  currentUserPoints: number = 0
): IHit[] =>
  Array.from({ length: number }, () => ({
    id: uuid(),
    value: Math.floor(Math.random() * 10 + currentUserPoints * 0.01),
  }));
