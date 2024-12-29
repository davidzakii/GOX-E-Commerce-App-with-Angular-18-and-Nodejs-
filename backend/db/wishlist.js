import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'users' },
  productsId: Array(String),
});

export const WishList = mongoose.model('wishlists', wishListSchema);
