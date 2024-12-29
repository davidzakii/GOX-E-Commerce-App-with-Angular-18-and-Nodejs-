export interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categoryId: string;
  brandId: string;
  isFeatured?:Boolean;
  isNewProduct?:Boolean;
  _v: number;
}
