export class FindAllUsersQuery {
  constructor(
    public readonly queryOptions: {
      skip?: number;
      take?: number;
      where?: {
        email?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
      };
    },
  ) {}
}
