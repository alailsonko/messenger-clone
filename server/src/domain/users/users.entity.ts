// user.entity.ts

import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  validate as validateClassValidator,
  IsUUID,
} from 'class-validator';

class UserEntity {
  @IsUUID('4', { message: 'Invalid UUID format' })
  id: string;

  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  createdAt: Date;
  updatedAt: Date;
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

  async validate(): Promise<string[]> {
    const errors = await validateClassValidator(this);
    return errors.map((error) => Object.values(error.constraints)).flat();
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

export { UserEntity };
