import { Cart } from '../db/cart.js';
import Joi from 'joi';
import { getProductById } from './product-handler.js';
const userIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required();
const productIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required();
export async function addToCart(userId, productId, quantity) {
  const { error } = userIdSchema.validate(userId);
  if (error) throw new Error('Invalid User ID');
  const { productIdError } = productIdSchema.validate(productId);
  if (productIdError) throw new Error('Invalid product ID');
  const cart = await Cart.findOne({ userId, productId });
  const product = await getProductById(productId);
  if (cart) {
    if (quantity > 0) {
      if (cart.count + quantity > product.quantity) {
        return null;
      }
      cart.count += quantity;
    } else if (quantity < 0) {
      if (cart.count + quantity <= 0) {
        await Cart.findByIdAndDelete(cart._id);
        return '';
      }
      cart.count += quantity;
    }
    await cart.save();
    return cart;
  } else {
    const newCart = new Cart({
      userId,
      productId,
      count: quantity,
    });
    await newCart.save();
    return newCart;
  }
}
export async function removeFromCart(userId, productId) {
  const { error } = userIdSchema.validate(userId);
  if (error) throw new Error('Invalid User ID');
  const { productIdError } = productIdSchema.validate(productId);
  if (productIdError) throw new Error('Invalid product ID');
  const cart = await Cart.findOne({ userId, productId });
  if (cart) {
    await Cart.findByIdAndDelete(cart._id);
  } else {
    throw new Error('Cart is not exist');
  }
}

export async function getCartItems(userId) {
  const { error } = userIdSchema.validate(userId);
  if (error) throw new Error('Invalid User ID');
  const carts = await Cart.find({ userId }).populate('productId');
  return carts.map((cart) => {
    return { count: cart.count, product: cart.productId };
  });
}

export async function clearCart(userId) {
  await Cart.deleteMany({
    userId,
  });
}
