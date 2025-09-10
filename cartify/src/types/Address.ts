import { type UserType } from './User';

export interface AddressType {
  _id: string;
  createdBy: UserType | string;
  status: 'active' | 'inactive';
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: number;
  country: string;
  isDefault: boolean;
}
