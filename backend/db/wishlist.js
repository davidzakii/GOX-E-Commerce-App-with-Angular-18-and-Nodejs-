import mongoose from 'mongoose';
// import { Product } from './product.js';

const wishListSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products',
        required: true,
      },
    },
  ],
});

// wishListSchema.pre('save', async function (next) {
//   for (const product of this.products) {
//     const productExists = await Product.findById(product.productId);
//     if (!productExists) {
//       throw new Error(`Product with ID ${product.productId} does not exist`);
//     }
//   }
//   next();
// });

export const WishList = mongoose.model('wishlists', wishListSchema);
