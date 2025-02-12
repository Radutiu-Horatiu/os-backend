import { model, Schema, Document } from 'mongoose';

interface ITransfer extends Document {
  id: string;
  createdAt: string;
  amount: number;
  address: string;
  signature?: string;
  itemId?: string;
}

const TransferSchema = new Schema({
  id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  signature: { type: String, default: null },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  itemId: { type: String, default: null },
});

const TransferModel = model<ITransfer>('Transfer', TransferSchema);

export { TransferModel, ITransfer };
