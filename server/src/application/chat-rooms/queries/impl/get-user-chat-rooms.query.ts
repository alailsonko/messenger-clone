export class GetUserChatRoomsQuery {
  constructor(
    public readonly userId: string,
    public readonly query: {
      take: number;
      skip: number;
    },
  ) {}
}
