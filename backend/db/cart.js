import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  count: { type: Number, required: true, default: 0 },
});

export const Cart = mongoose.model('carts', cartSchema);
