import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { USER_OPERATIONS, UsersEntity } from 'src/domain/users/users.entity';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

/**
 * Repository class for handling user-related database operations.
 */
@Injectable()
class UsersRepository {
  /**
   * Constructor for UsersRepository class.
   *
   * @param prisma - PrismaService instance for database interactions.
   */
  constructor(
    private prisma: PrismaService,
    private usersEntity: UsersEntity,
  ) {}

  /**
   * Retrieves a unique user based on the provided unique input.
   *
   * @param userWhereUniqueInput - Unique input to find a user.
   * @returns A UsersEntity instance representing the found user.
   */
  async findUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UsersEntity> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    return this.usersEntity.plainToClass(user);
  }

  /**
   * Retrieves a list of users based on specified parameters.
   *
   * @param params - Parameters for filtering and pagination.
   * @returns An array of UsersEntity instances representing the found users.
   */
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

    return users.map((user) => this.usersEntity.plainToClass(user));
  }

  /**
   * Creates a new user with the provided data.
   *
   * @param data - User creation data.
   * @returns A UsersEntity instance representing the newly created user.
   * @throws Error if validation fails.
   */
  async create(data: Prisma.UserCreateInput): Promise<UsersEntity> {
    const errors = await this.usersEntity.validate(
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

    const user = await this.prisma.user.create({
      data,
    });

    return this.usersEntity.plainToClass(user);
  }

  /**
   * Updates an existing user based on the provided parameters.
   *
   * @param params - Update parameters including where condition and data.
   * @returns A UsersEntity instance representing the updated user.
   * @throws Error if validation fails.
   */
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UsersEntity> {
    const { where, data } = params;
    const errors = await this.usersEntity.validate(
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

    const user = await this.prisma.user.update({
      data,
      where,
    });

    return this.usersEntity.plainToClass(user);
  }

  /**
   * Deletes a user based on the provided unique input.
   *
   * @param where - Unique input to identify the user to be deleted.
   * @returns A UsersEntity instance representing the deleted user.
   */
  async delete(where: Prisma.UserWhereUniqueInput): Promise<UsersEntity> {
    const user = await this.prisma.user.delete({
      where,
    });

    return this.usersEntity.plainToClass(user);
  }
}

export { UsersRepository };
