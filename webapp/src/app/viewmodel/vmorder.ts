import { Product } from '../models/product';

export interface VMOrder {
  id?: string;
  userId?: {
    _id: string;
    name: string;
  };
  items: {
    productId: Product;
    quantity: number;
  }[];
  address: {
    address1: string;
    address2?: string;
    phoneNumber: string;
    city: string;
    postalCode: number;
  };
  totalAmount: number;
  paymentType: string;
  status?: string;
  isPaid?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
