import {
  ChatRoomResponseObject,
  MessageResponseObject,
  ProfileResponseObject,
} from '../api/Api';

export const fullname = (
  chatRoom: ChatRoomResponseObject,
  loggedUser: ProfileResponseObject
) => {
  if (!chatRoom) {
    throw new Error('chatRoom is not defined');
  }

  const isSelfChat =
    chatRoom.usersChatRooms.length === 1 &&
    chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id);

  if (isSelfChat) {
    return (
      chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id)?.user
        .firstName +
      ' ' +
      chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id)?.user
        .lastName
    );
  }

  return (
    chatRoom.usersChatRooms.find((u) => u.userId !== loggedUser.id)?.user
      .firstName +
    ' ' +
    chatRoom.usersChatRooms.find((u) => u.userId !== loggedUser.id)?.user
      .lastName
  );
};
export const avatarUrl = (
  chatRoom: ChatRoomResponseObject,
  loggedUser: ProfileResponseObject
) => {
  if (!chatRoom) {
    throw new Error('chatRoom is not defined');
  }

  const isSelfChat =
    chatRoom.usersChatRooms.length === 1 &&
    chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id);

  if (isSelfChat) {
    return (
      process.env.REACT_APP_BACKEND_URL +
      '/' +
      chatRoom.usersChatRooms.find((u) => u.userId === loggedUser.id)?.user
        .avatar.url!
    );
  }

  return (
    process.env.REACT_APP_BACKEND_URL +
    '/' +
    chatRoom.usersChatRooms.find((u) => u.userId !== loggedUser.id)?.user.avatar
      .url!
  );
};

export const message = (
  chatRoom: ChatRoomResponseObject,
  chatRoomId: string
) => {
  return chatRoom.id !== chatRoomId && chatRoom.messages.length
    ? chatRoom.messages[0].content
    : '';
};

export const messageFrom = (
  chatRoom: ChatRoomResponseObject,
  chatRoomId: string,
  loggedUserId: string
) => {
  return chatRoom.messages.length &&
    chatRoom.id !== chatRoomId &&
    chatRoom.messages[0].senderId === loggedUserId
    ? 'You: '
    : '';
};
