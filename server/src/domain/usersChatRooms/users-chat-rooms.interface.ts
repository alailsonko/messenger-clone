import { IUser } from '../users/users.interface';

export interface IUserChatRoom {
  userId: string;
  chatRoomId: string;
  user: IUser;
}
