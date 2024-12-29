import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  UserId: { type: mongoose.Types.ObjectId, ref: 'users' },
  productsId: Array(String),
});

export const Cart = mongoose.model('carts', cartSchema);
