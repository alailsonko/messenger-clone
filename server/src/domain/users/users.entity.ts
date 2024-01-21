import { Injectable } from '@nestjs/common';
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
@Injectable()
class UsersEntity {
  private _id: string;
  private _username: string;
  private _password: string;
  private _email: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _lastLogin: Date | null;

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
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

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
  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

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
  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

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
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

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
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

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
  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

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
  get lastLogin(): Date | null {
    return this._lastLogin;
  }

  set lastLogin(value: Date | null) {
    this._lastLogin = value;
  }

  /**
   * Converts a plain user object to a UsersEntity instance.
   *
   * @param user - Partial user object.
   * @returns UsersEntity instance.
   */
  plainToClass(user: Partial<UsersEntity>) {
    return plainToClass(UsersEntity, user);
  }

  /**
   * Validates a partial user object based on the specified operation.
   *
   * @param user - Partial user object.
   * @param operation - User operation (CREATE, UPDATE, READ).
   * @returns Validation errors, if any.
   */
  async validate(
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
