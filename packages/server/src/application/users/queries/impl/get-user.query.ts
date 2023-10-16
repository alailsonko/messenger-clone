import { UsersAttrs } from 'src/domain/users/users.entity';

export class GetUserQuery {
  constructor(
    public readonly findOpts: Partial<
      Pick<UsersAttrs, 'id' | 'email' | 'username'>
    >,
  ) {}
}
