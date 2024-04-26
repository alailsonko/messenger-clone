import { IUser } from '../users';

export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  chatRoomId: string;
  createdAt: Date;
  updatedAt: Date;
  sender?: IUser;
}
