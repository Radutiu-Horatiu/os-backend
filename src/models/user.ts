import { model, Schema, Document } from 'mongoose';
import { rawScenes } from '../constants/scenes';
import { rawAvatars } from '../constants/avatars';

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

const ClaimSchema = new Schema({
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

interface IClaim {
  id: string;
  value: number;
}

interface IUser extends Document {
  id: string;
  createdAt: string;
  walletAddress: string;
  points: number;
  avatar: string;
  scene: string;
  hits: IHit[];
  claims: IClaim[];
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
  avatar: {
    type: String,
    default: null,
  },
  scene: {
    type: String,
    default: null,
  },
  hits: [HitSchema],
  claims: [ClaimSchema],
  scenes: {
    type: [String],
    default: [rawScenes[0].id],
  },
  avatars: {
    type: [String],
    default: [rawAvatars[0].id],
  },
});

const UserModel = model<IUser>('User', UserSchema);

export { UserModel, IUser, IHit, IClaim };
