import { model, Schema, Document } from 'mongoose';
import { scenes } from '../constants/scenes';
import { avatars } from '../constants/avatars';

const HitSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
});

interface IHit {
  id: string;
  value: number;
}

interface IUser extends Document {
  id: string;
  createdAt: string;
  walletAddress: string;
  points: number;
  inWalletPoints: number;
  avatar: string;
  scene: string;
  hits: IHit[];
  scenes: string[];
  avatars: string[];
}

const UserSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  inWalletPoints: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: null,
  },
  scene: {
    type: String,
    default: null,
  },
  hits: [HitSchema],
  scenes: {
    type: [String],
    default: [scenes[0].id],
  },
  avatars: {
    type: [String],
    default: [avatars[0].id],
  },
});

const UserModel = model<IUser>('User', UserSchema);

export { UserModel, IUser, IHit };
