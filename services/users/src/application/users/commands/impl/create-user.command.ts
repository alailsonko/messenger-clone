export class CreateUserCommand {
  constructor(
    public readonly data: {
      email: string;
      username: string;
      clientId: string;
    },
  ) {}
}
