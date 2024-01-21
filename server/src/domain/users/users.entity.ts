import { Type, plainToClass } from 'class-transformer';
import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  validate as validateClassValidator,
  IsUUID,
  IsOptional,
  IsDate,
} from 'class-validator';

export enum USER_OPERATIONS {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  READ = 'READ',
}

class UsersEntity {
  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE, USER_OPERATIONS.CREATE],
  })
  @IsUUID('4', {
    message: 'Invalid UUID format',
    groups: [USER_OPERATIONS.READ],
  })
  id: string;

  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE],
  })
  @IsNotEmpty({
    message: 'Username cannot be empty',
    groups: [
      USER_OPERATIONS.READ,
      USER_OPERATIONS.CREATE,
      USER_OPERATIONS.UPDATE,
    ],
  })
  username: string;

  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE],
  })
  @IsNotEmpty({
    message: 'Password cannot be empty',
    groups: [
      USER_OPERATIONS.READ,
      USER_OPERATIONS.CREATE,
      USER_OPERATIONS.UPDATE,
    ],
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
    groups: [
      USER_OPERATIONS.READ,
      USER_OPERATIONS.CREATE,
      USER_OPERATIONS.UPDATE,
    ],
  })
  password: string;

  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE],
  })
  @IsNotEmpty({
    message: 'Email cannot be empty',
    groups: [
      USER_OPERATIONS.READ,
      USER_OPERATIONS.CREATE,
      USER_OPERATIONS.UPDATE,
    ],
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email format',
      groups: [
        USER_OPERATIONS.READ,
        USER_OPERATIONS.CREATE,
        USER_OPERATIONS.UPDATE,
      ],
    },
  )
  email: string;

  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE, USER_OPERATIONS.CREATE],
  })
  @Type(() => Date)
  @IsDate({
    groups: [USER_OPERATIONS.READ],
  })
  createdAt: Date;

  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE, USER_OPERATIONS.CREATE],
  })
  @Type(() => Date)
  @IsDate({
    groups: [USER_OPERATIONS.READ],
  })
  updatedAt: Date;

  @IsOptional({
    groups: [
      USER_OPERATIONS.UPDATE,
      USER_OPERATIONS.CREATE,
      USER_OPERATIONS.READ,
    ],
  })
  @Type(() => Date)
  @IsDate({
    groups: [USER_OPERATIONS.READ],
  })
  lastLogin: Date | null;

  constructor(
    id: string,
    username: string,
    password: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    lastLogin: Date | null,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLogin = lastLogin;
  }

  static toArray(
    list: {
      id: string;
      username: string;
      password: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      lastLogin: Date | null;
    }[],
  ) {
    return list.map(
      ({ createdAt, email, id, lastLogin, password, updatedAt, username }) =>
        new UsersEntity(
          id,
          username,
          password,
          email,
          createdAt,
          updatedAt,
          lastLogin,
        ),
    );
  }

  static async validate(
    user: Partial<UsersEntity>,
    operation: USER_OPERATIONS,
  ): Promise<{ [type: string]: string }[]> {
    const parsedUserEntity = plainToClass(UsersEntity, user);

    const errors = await validateClassValidator(parsedUserEntity, {
      groups: [operation],
    });

    return errors.map((error) => error.constraints);
  }

  toObject() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin,
    };
  }
}

export { UsersEntity };
