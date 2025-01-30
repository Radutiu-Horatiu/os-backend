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
  id: string;
  created_at: string;
  wallet_address: string;
  claimed_points: number;
  unclaimed_points: number;
  hits: IHit[];
}

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  wallet_address: {
    type: String,
    required: true,
  },
  claimed_points: {
    type: Number,
    default: 0,
  },
  unclaimed_points: {
    type: Number,
    default: 0,
  },
  hits: [HitSchema],
});

const UserModel = model<IUser>('User', UserSchema);

export { UserModel, IUser };
