export class GetMessagesQuery {
  constructor(
    public readonly chatId: string,
    public query: {
      skip: number;
      take: number;
    },
  ) {}
}
