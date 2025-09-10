export type UserRole = 'customer' | 'admin' | 'seller';

export interface UserType {
  _id: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatar: string;
  phoneNumber: string;
  favorite: [string];
  refreshToke: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
