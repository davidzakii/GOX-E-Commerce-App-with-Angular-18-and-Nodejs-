import { Product } from '../db/product.js';

export async function getProducts() {
  let products = await Product.find();
  return products;
}

export async function getProductById(id) {
  let product = await Product.findById(id);
  return product;
}

export async function addProduct(model) {
  let product = new Product({
    ...model,
  });
  await product.save();
  return product;
}
export async function updateProduct(id, model) {
  await Product.findByIdAndUpdate(id, model);
  return;
}
export async function deleteProduct(id) {
  await Product.findByIdAndDelete(id);
  return;
}

export async function getNewProduct() {
  let newProducts = await Product.find({
    isNewProduct: true,
  });
  return newProducts;
}
export async function getFeaturedProduct() {
  let newProducts = await Product.find({
    isFeatured: true,
  });
  return newProducts;
}

export async function getProductsByCategoryId(id) {
  let newProducts = await Product.find({
    categoryId: id,
  });
  return newProducts;
}
