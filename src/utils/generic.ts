import { Avatar } from '../constants/avatars';
import { Scene } from '../constants/scenes';
import { getSupplyPercentageChange } from './token';

export type Cosmetic = Avatar | Scene;

export const progressiveValues = (
  n: number,
  multiplier: number,
  startValue: number
): number[] => {
  const arr = [startValue];
  for (let i = 1; i < n; i++) {
    const value = arr[i - 1] * multiplier;
    arr.push(value);
  }
  return arr.map((el) => Math.round(el));
};

export const addPointsAndMultiplier = async (
  cosmetics: Cosmetic[]
): Promise<Cosmetic[]> => {
  const supplyPercentageChange = await getSupplyPercentageChange();

  return cosmetics.map((el: Cosmetic, i, arr) => {
    // calculate points
    el.points = progressiveValues(arr.length, 1.65, 500)[i];
    el.points += el.points * supplyPercentageChange;
    el.points = Math.round(el.points);

    // calculate multiplier
    el.multiplier = progressiveValues(arr.length, 1.25, 1)[i];
    return el;
  });
};
