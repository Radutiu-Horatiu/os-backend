import { model, Schema, Document } from 'mongoose';

const HitSchema = new Schema({
  value: {
    type: Number,
    default: 0,
  },
});

interface IHit {
  value: number;
}

interface IUser extends Document {
  createdAt: string;
  walletAddress: string;
  claimedPoints: number;
  unclaimedPoints: number;
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
  hits: [HitSchema],
});

const UserModel = model<IUser>('User', UserSchema);

export { UserModel, IUser, IHit };
