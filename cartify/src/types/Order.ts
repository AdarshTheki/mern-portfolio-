import type { ProductType } from './Product';

export type OrderStatusType = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderType {
  _id: string;
  customer: string;
  shipping_address: {
    name: string;
    email: string;
    line1: string;
    line2: string;
    city: string;
    country: string;
    postal_code: string;
    state: string;
  };
  totalPrice: number;
  status: OrderStatusType;
  items: {
    productId: string;
    quantity: number;
    product: ProductType;
  }[];
  payment: {
    id: string;
    status: string;
    method: string;
  };
  createdAt: string;
  updatedAt: string;
}
