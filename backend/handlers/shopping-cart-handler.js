import { Cart } from '../db/cart.js';
import Joi from 'joi';
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
  if (cart) {
    cart.count += quantity;
    await cart.save();
  } else {
    const newCart = new Cart({
      userId,
      productId,
      count: quantity,
    });
    await newCart.save();
  }
}
export async function removeFromCart(userId, productId) {
  const { error } = userIdSchema.validate(userId);
  if (error) throw new Error('Invalid User ID');
  const { productIdError } = productIdSchema.validate(productId);
  if (productIdError) throw new Error('Invalid product ID');
  const cart = await Cart.findOne({ userId, productId });
  if (cart) {
    if (cart.count > 1) cart.count -= 1;
    else await Cart.findByIdAndDelete(cart._id);
    await cart.save();
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
