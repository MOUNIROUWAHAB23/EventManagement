import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const paymentSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  userId: { type: String, ref: 'Users', required: true },
  eventId: { type: String, ref: 'Event', required: true },
  amount: { type: Number, required: true },
  stripePaymentIntentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);