export class CreateCredentialCommand {
  constructor(
    public readonly data: { username: string; passwordHash: string },
  ) {}
}
