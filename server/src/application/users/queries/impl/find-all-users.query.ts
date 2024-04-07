export class FindAllUsersQuery {
  constructor(
    public readonly queryOptions: {
      skip?: number;
      take?: number;
    },
  ) {}
}
