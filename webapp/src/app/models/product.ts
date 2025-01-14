export interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  images: string[];
  categoryId: string;
  brandId: string;
  isFeatured?: Boolean;
  isNewProduct?: Boolean;
  reviews: [
    {
      userId: string;
      comment: string;
      rating: number;
    }
  ];
  _v: number;
}
