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

/**
 * Enumeration representing different user operations.
 */
export enum USER_OPERATIONS {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  READ = 'READ',
}

/**
 * Represents a user entity with validation using class-validator.
 */
class UsersEntity {
  /**
   * User ID (UUID format).
   */
  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE, USER_OPERATIONS.CREATE],
  })
  @IsUUID('4', {
    message: 'Invalid UUID format',
    groups: [USER_OPERATIONS.READ],
  })
  id: string;

  /**
   * User's username.
   */
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

  /**
   * User's password.
   */
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

  /**
   * User's email address.
   */
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

  /**
   * User's creation date.
   */
  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE, USER_OPERATIONS.CREATE],
  })
  @Type(() => Date)
  @IsDate({
    groups: [USER_OPERATIONS.READ],
  })
  createdAt: Date;

  /**
   * User's last update date.
   */
  @IsOptional({
    groups: [USER_OPERATIONS.UPDATE, USER_OPERATIONS.CREATE],
  })
  @Type(() => Date)
  @IsDate({
    groups: [USER_OPERATIONS.READ],
  })
  updatedAt: Date;

  /**
   * User's last login date.
   */
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

  /**
   * Constructor to create an instance of UsersEntity.
   *
   * @param id - User ID (UUID format).
   * @param username - User's username.
   * @param password - User's password.
   * @param email - User's email address.
   * @param createdAt - User's creation date.
   * @param updatedAt - User's last update date.
   * @param lastLogin - User's last login date.
   */
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

  /**
   * Converts an array of plain user objects to an array of UsersEntity instances.
   *
   * @param list - Array of plain user objects.
   * @returns Array of UsersEntity instances.
   */
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

  /**
   * Converts a plain user object to a UsersEntity instance.
   *
   * @param user - Partial user object.
   * @returns UsersEntity instance.
   */
  static plainToClass(user: Partial<UsersEntity>) {
    return plainToClass(UsersEntity, user);
  }

  /**
   * Validates a partial user object based on the specified operation.
   *
   * @param user - Partial user object.
   * @param operation - User operation (CREATE, UPDATE, READ).
   * @returns Validation errors, if any.
   */
  static async validate(
    user: Partial<UsersEntity>,
    operation: USER_OPERATIONS,
  ): Promise<{ [type: string]: string }[]> {
    const parsedUserEntity = this.plainToClass(user);

    const errors = await validateClassValidator(parsedUserEntity, {
      groups: [operation],
    });

    return errors.map((error) => error.constraints);
  }

  /**
   * Returns a plain object representation of the UsersEntity instance.
   *
   * @returns Plain object representation.
   */
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
