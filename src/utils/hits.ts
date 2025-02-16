import { v4 as uuid } from 'uuid';

import { IHit, IUser } from '../models/user';
import { getAvatars } from '../constants/avatars';
import { getScenes } from '../constants/scenes';

const HITS_PER_USER: number = 20;

type GenerateHitsParams = {
  multiplier?: number;
  percentageChange?: number;
};

export const generateHits = ({
  multiplier = 1,
  percentageChange = 1,
}: GenerateHitsParams): IHit[] =>
  Array.from({ length: HITS_PER_USER }, () => {
    let value = (Math.random() * 10 + 1) * Math.max(multiplier, 1);
    value -= value * percentageChange;
    value = Math.floor(value);
    return {
      id: uuid(),
      value,
    };
  });

export const calculateMultiplier = async (user: IUser): Promise<number> => {
  let total = 0;

  const avatars = await getAvatars();
  const scenes = await getScenes();

  user.avatars.forEach((avatar: string) => {
    const currentAvatar = avatars.find((a) => a.id === avatar);
    if (currentAvatar) total += currentAvatar.multiplier;
  });

  user.scenes.forEach((scene: string) => {
    const currentScene = scenes.find((s) => s.id === scene);
    if (currentScene) total += currentScene.multiplier;
  });

  return Math.max(1, Number(total.toFixed(1)));
};
