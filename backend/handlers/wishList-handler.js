import Joi from 'joi';
import { WishList } from '../db/wishlist.js';
import { Product } from '../db/product.js';

// Validation schemas
const userIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required();
const productIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required();

// Handlers
export async function getWishList(userId) {
  const { error } = userIdSchema.validate(userId);
  if (error) throw new Error('Invalid User ID');
  const wishList = await WishList.findOne({ userId })
    .populate({
      path: 'products.productId',
    })
    .exec();
  wishList.products = wishList.products.filter(
    (product) => product.productId !== null
  );
  await wishList.save();
  return wishList;
}

export async function createWishList(userId) {
  const { error } = userIdSchema.validate(userId);
  if (error) throw new Error('Invalid User ID');

  const existingWishList = await WishList.findOne({ userId });
  if (existingWishList) {
    return null;
  } else {
    const newWishList = new WishList({
      userId,
      products: [],
    });
    await newWishList.save();
    return newWishList;
  }
}

export async function addProductInWishList(userId, productId) {
  const productExists = await Product.findById(productId);
  if (!productExists) {
    throw new Error('Invalid productId: Product does not exist');
  }
  const wishList = await WishList.findOne({ userId });
  if (wishList) {
    const productFound = wishList.products.find(
      (obj) => obj.productId == productId
    );
    if (productFound) {
      return null;
    } else {
      wishList.products.push({ productId: productId });
      await wishList.save();
      return wishList;
    }
  } else {
    return null;
  }
}

export async function removeProductFromWishList(userId, productId) {
  const userError = userIdSchema.validate(userId);
  const productError = productIdSchema.validate(productId);
  if (userError.error || productError.error) throw new Error('Invalid IDs');

  const wishList = await WishList.findOne({ userId });
  if (wishList) {
    const productFound = wishList.products.find(
      (obj) => obj.productId.toString() === productId
    );
    if (productFound) {
      wishList.products = wishList.products.filter(
        (obj) => obj.productId.toString() !== productId
      );
      await wishList.save();
      return wishList;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
