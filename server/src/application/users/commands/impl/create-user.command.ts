export class CreateUserCommand {
  constructor(
    public readonly user: {
      username: string;
      email: string;
      password: string;
    },
  ) {}
}
