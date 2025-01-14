import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: { type: [String], required: true },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    brandId: { type: mongoose.Types.ObjectId, ref: 'brands', required: true },
    isFeatured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false },
    reviews: {
      type: [
        {
          userId: { type: mongoose.Types.ObjectId, ref: 'users' },
          comment: { type: String },
          rating: { type: Number, default: 0, min: 0, max: 5 },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model('products', productSchema);
