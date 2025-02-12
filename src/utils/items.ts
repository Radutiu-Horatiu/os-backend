import { avatars } from '../constants/avatars';
import { scenes } from '../constants/scenes';

export enum ItemType {
  Avatar = 'avatars',
  Scene = 'scenes',
}

export interface ItemResult {
  data: any;
  type: ItemType;
}

export const getItemById = (id: string) => {
  const avatar = avatars.find((item) => item.id === id);
  const scene = scenes.find((item) => item.id === id);

  if (avatar) return { data: avatar, type: ItemType.Avatar };
  if (scene) return { data: scene, type: ItemType.Scene };

  return null;
};
