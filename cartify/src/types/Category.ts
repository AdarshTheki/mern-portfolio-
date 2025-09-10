import type { UserType } from './User';

export interface CategoryType {
  _id: string;
  status: 'active' | 'inactive';
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserType | string;
}
