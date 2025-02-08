import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    address: {
      address1: { type: String, required: true },
      address2: { type: String },
      phoneNumber: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: Number, required: true },
    },
    paymentType: {
      type: String,
      required: true,
      enum: ['cash', 'paypal', 'stripe'],
    },
    totalAmount: { type: Number, requird: true },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      default: 'Dispatched',
      enum: ['Dispatched', 'Shipped', 'Delivered'],
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('orders', orderSchema);
