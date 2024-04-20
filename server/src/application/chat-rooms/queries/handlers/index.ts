import { CheckUserChatRoomExistsHandler } from './check-user-chat-room-exists.handler';
import { GetUserChatRoomsHandler } from './get-user-chat-rooms.handler';

export const QueryHandlers = [
  GetUserChatRoomsHandler,
  CheckUserChatRoomExistsHandler,
];
