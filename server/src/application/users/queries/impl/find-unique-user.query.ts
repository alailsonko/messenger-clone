export class FindUniqueUserQuery {
  constructor(
    public readonly findOptions: {
      email?: string;
      username?: string;
    },
    public readonly include?: {
      userPermissions?: boolean;
      UserGroup?: boolean;
      AdminLog?: boolean;
    },
  ) {}
}
