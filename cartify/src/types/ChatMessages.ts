import type { UserType } from './User';

export interface ChatType {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  isGroupChat: boolean;
  lastMessage: MessageType | null;
  participants: [UserType];
  admin: string;
}

export interface MessageType {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  sender: UserType;
  chat: string;
  content: string;
  attachments: string[];
}
