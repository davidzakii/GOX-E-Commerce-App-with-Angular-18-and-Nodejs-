import { Product } from './product';

export interface WishList {
  _id: string;
  userId: string;
  products: [
    {
      productId: Product;
      _id: string;
    }
  ];
}
