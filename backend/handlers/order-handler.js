import { Order } from '../db/order.js';
import { updateProductQuantity } from './product-handler.js';
import { clearCart } from './shopping-cart-handler.js';

export async function addOrder(userId, body) {
  const newOrder = new Order({
    userId,
    ...body,
  });
  if (newOrder.isPaid) {
    // newOrder.items.forEach(async (item) => {
    //   await updateProductQuantity(item.productId, item.quantity);
    // });
    const updatePromises = newOrder.items.map((item) =>
      updateProductQuantity(item.productId, item.quantity)
    );
    await Promise.all(updatePromises);
  }
  await newOrder.save();
  await clearCart(userId);
  return newOrder;
}

export async function getCustomerOrders(userId) {
  const orders = await Order.find({ userId }).populate('items.productId');
  return orders;
}

export async function getOrdersWithProduct(productId) {
  const orders = await Order.find({ 'items.productId': productId });
  return orders;
}
export async function getOrders() {
  const orders = await Order.find({})
    .populate('items.productId')
    .populate('userId', 'name');
  return orders;
}

export async function getOrderById(id) {
  const order = await Order.findById(id)
    .populate('items.productId')
    .populate('userId', 'name');
  return order;
}

export async function updateOrderStatus(id, status) {
  const order = await Order.findById(id);
  order.status = status;
  await order.save();
  return order;
}

export async function updateOrderPaid(id, paid) {
  const order = await Order.findById(id);
  order.isPaid = paid;
  if (order.isPaid) {
    const updatePromises = order.items.map((item) =>
      updateProductQuantity(item.productId, item.quantity)
    );
    await Promise.all(updatePromises);
  } else {
    const updatePromises = order.items.map((item) =>
      updateProductQuantity(item.productId, -item.quantity)
    );
    await Promise.all(updatePromises);
  }
  await order.save();
  return order;
}
