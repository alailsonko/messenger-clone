export class CreateUserChatRoomCommand {
  constructor(
    public readonly userId: string,
    public readonly data: {
      name: string;
      userIds: string[];
    },
  ) {}
}
