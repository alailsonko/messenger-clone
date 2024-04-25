import { IUserChatRoom } from '../usersChatRooms';

export interface IChatRoom {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  usersChatRooms: IUserChatRoom[];
}
