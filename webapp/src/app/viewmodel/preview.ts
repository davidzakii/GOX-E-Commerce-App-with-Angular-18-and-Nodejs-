export interface PReview {
  userId?: {
    _id: string;
    name: string;
  };
  comment: string;
  rating: number;
  _id?: string;
}
