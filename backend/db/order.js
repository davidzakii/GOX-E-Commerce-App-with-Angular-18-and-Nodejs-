import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  date: Date,
  items: Array(any),
  status: Number,
});

export const Order = mongoose.model('orders', orderSchema);
