import { Avatar } from '../constants/avatars';
import { Scene } from '../constants/scenes';

export type Cosmetic = Avatar | Scene;

export const progressiveValues = (
  n: number,
  multiplier: number,
  startValue: number
): number[] => {
  const arr = [startValue];
  for (let i = 1; i < n; i++) {
    const value = arr[i - 1] * multiplier;
    arr.push(Number(value.toFixed(1)));
  }
  return arr;
};

export const addPointsAndMultiplier = (cosmetics: Cosmetic[]): Cosmetic[] =>
  cosmetics.map((el: Cosmetic, i, arr) => {
    el.points = progressiveValues(arr.length, 1.65, 500)[i];
    el.multiplier = progressiveValues(arr.length, 1.2, 1)[i];
    return el;
  });
