export class SignInCommand {
  constructor(
    public readonly user: { id: string; username: string; email: string },
  ) {}
}
