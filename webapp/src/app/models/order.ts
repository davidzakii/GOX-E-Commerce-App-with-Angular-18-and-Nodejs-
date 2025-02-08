export interface Order {
  items: {
    productId: string;
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
}
