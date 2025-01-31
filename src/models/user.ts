import { model, Schema, Document } from 'mongoose';

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
  createdAt: string;
  walletAddress: string;
  claimedPoints: number;
  unclaimedPoints: number;
  avatar: string;
  scene: string;
  hits: IHit[];
}

const UserSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  claimedPoints: {
    type: Number,
    default: 0,
  },
  unclaimedPoints: {
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
});

const UserModel = model<IUser>('User', UserSchema);

export { UserModel, IUser, IHit };
