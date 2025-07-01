import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const registrationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  eventId: {
    type: String,
    ref: 'Event',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Registration', registrationSchema);