import { UsersAttrs } from 'src/domain/users/users.entity';

export class GetUserQuery {
  constructor(
    public readonly findOpts: Pick<UsersAttrs, 'id' | 'email' | 'username'>,
  ) {}
}
