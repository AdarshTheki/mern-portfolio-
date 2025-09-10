export type ProductStatusType = 'active' | 'inactive' | 'out-of-stock' | 'pending';

export interface ProductType {
  _id: string;
  status: ProductStatusType;
  title: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
