export class CreateMessageCommand {
  constructor(
    public readonly senderId: string,
    public readonly chatRoomId: string,
    public readonly data: {
      content: string;
    },
  ) {}
}
