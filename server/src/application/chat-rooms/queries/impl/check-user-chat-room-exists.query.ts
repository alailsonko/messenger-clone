export class CheckUserChatRoomExistsQuery {
  constructor(
    public readonly userId: string,
    public readonly recipientId: string,
  ) {}
}
