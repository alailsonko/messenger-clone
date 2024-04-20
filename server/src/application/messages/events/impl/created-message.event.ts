export class CreatedMessageEvent {
  constructor(
    public readonly userId: string,
    public readonly chatRoomId: string,
    public readonly messageId: string,
  ) {}
}
