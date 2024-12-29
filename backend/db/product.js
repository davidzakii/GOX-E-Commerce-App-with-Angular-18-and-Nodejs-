import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  shortDescription: String,
  description: String,
  price: Number,
  discount: Number,
  images: Array(String),
  categoryId: { type: mongoose.Types.ObjectId, ref: 'categories' },
  brandId: { type: mongoose.Types.ObjectId, ref: 'brands' },
  isFeatured: Boolean,
  isNewProduct: Boolean,
});

export const Product = mongoose.model('products', productSchema);
