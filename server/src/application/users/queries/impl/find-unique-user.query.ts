export class FindUniqueUserQuery {
  constructor(
    public readonly findOptions: {
      email?: string;
      username?: string;
      id?: string;
    },
    public readonly include?: {
      permissions?: boolean;
      groups?: boolean;
      AdminLogs?: boolean;
    },
  ) {}
}
