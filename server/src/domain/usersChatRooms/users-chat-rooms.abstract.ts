export abstract class UserChatRoomAbstract {
  abstract get userId(): string;
  abstract set userId(value: string);

  abstract get chatRoomId(): string;
  abstract set chatRoomId(value: string);
}
