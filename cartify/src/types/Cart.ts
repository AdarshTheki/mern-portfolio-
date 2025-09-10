import type { ProductType } from './Product';

export interface CartItemType {
  _id: string;
  productId: ProductType | string;
  quantity: number;
}

export interface CartsType {
  items: CartItemType[];
  wishlist: CartItemType[];
  createdBy: string;
}
