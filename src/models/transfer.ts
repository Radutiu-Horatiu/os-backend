import { model, Schema, Document } from 'mongoose';

interface ITransfer extends Document {
  id: string;
  createdAt?: string;
  completed?: boolean;
  signature?: string;
  amount: number;
  address: string;
}

const TransferSchema = new Schema({
  id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  signature: { type: String, default: null },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
});

const TransferModel = model<ITransfer>('Transfer', TransferSchema);

export { TransferModel, ITransfer };
