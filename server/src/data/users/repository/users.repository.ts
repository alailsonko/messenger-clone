import { Prisma } from '@prisma/client';
import { USER_OPERATIONS, UsersEntity } from 'src/domain/users/users.entity';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    const { createdAt, email, id, lastLogin, password, updatedAt, username } =
      await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });

    return new UsersEntity(
      id,
      username,
      password,
      email,
      createdAt,
      updatedAt,
      lastLogin,
    );
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UsersEntity[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return UsersEntity.toArray(users);
  }

  async create(data: Prisma.UserCreateInput): Promise<UsersEntity> {
    const errors = await UsersEntity.validate(
      {
        email: data.email,
        username: data.username,
        password: data.password,
      },
      USER_OPERATIONS.CREATE,
    );

    if (errors.length) {
      throw new Error(errors.toString());
    }

    const { createdAt, email, id, lastLogin, password, updatedAt, username } =
      await this.prisma.user.create({
        data,
      });

    return new UsersEntity(
      id,
      username,
      password,
      email,
      createdAt,
      updatedAt,
      lastLogin,
    );
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UsersEntity> {
    const { where, data } = params;
    const errors = await UsersEntity.validate(
      {
        email: data.email && data.email.toString(),
        username: data.username && data.username.toString(),
        password: data.password && data.password.toString(),
        lastLogin: data.lastLogin && new Date(data.lastLogin.toString()),
      },
      USER_OPERATIONS.UPDATE,
    );

    if (errors.length) {
      throw new Error(errors.toString());
    }

    const { createdAt, email, id, lastLogin, password, updatedAt, username } =
      await this.prisma.user.update({
        data,
        where,
      });

    return new UsersEntity(
      id,
      username,
      password,
      email,
      createdAt,
      updatedAt,
      lastLogin,
    );
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<UsersEntity> {
    const { createdAt, email, id, lastLogin, password, updatedAt, username } =
      await this.prisma.user.delete({
        where,
      });

    return new UsersEntity(
      id,
      username,
      password,
      email,
      createdAt,
      updatedAt,
      lastLogin,
    );
  }
}

export { UsersRepository };
