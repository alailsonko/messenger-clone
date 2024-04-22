export class GetUserChatRoomQuery {
  constructor(
    public readonly userId: string,
    public readonly chatRoomId: string,
  ) {}
}
