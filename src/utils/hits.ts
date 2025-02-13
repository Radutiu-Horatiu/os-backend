import { v4 as uuid } from 'uuid';

import { IHit, IUser } from '../models/user';
import { avatars } from '../constants/avatars';
import { scenes } from '../constants/scenes';

export const generateHits = (number: number, multiplier: number = 1): IHit[] =>
  Array.from({ length: number }, () => ({
    id: uuid(),
    value: Math.floor((Math.random() * 10 + 1) * multiplier),
  }));

export const calculateMultiplier = (user: IUser): number => {
  let total = 0;

  user.avatars.forEach((avatar: string) => {
    const currentAvatar = avatars.find((a) => a.id === avatar);

    if (currentAvatar) total += currentAvatar.multiplier;
  });

  user.scenes.forEach((scene: string) => {
    const currentScene = scenes.find((s) => s.id === scene);

    if (currentScene) total += currentScene.multiplier;
  });

  return Number(total.toFixed(1));
};
