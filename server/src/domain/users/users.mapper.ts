import { User } from '@prisma/client';
import { UsersEntity } from './users.entity';
import { UsersModel } from './users.model';

class UsersMapper {
  static toDomain(raw: User): UsersEntity {
    const user = new UsersEntity();

    user.id = raw.id;
    user.isSuperUser = raw.isSuperUser;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.isStaff = raw.isStaff;
    user.isActive = raw.isActive;
    user.username = raw.username;
    user.password = raw.password;
    user.email = raw.email;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.lastLogin = raw.lastLogin;

    return user;
  }

  static toPersistence(user: UsersEntity): User {
    return {
      id: user.id,
      isSuperUser: user.isSuperUser,
      firstName: user.firstName,
      lastName: user.lastName,
      isStaff: user.isStaff,
      isActive: user.isActive,
      username: user.username,
      password: user.password,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  }

  static toModel(raw: User): UsersModel {
    const user = new UsersModel();

    user.id = raw.id;
    user.isSuperUser = raw.isSuperUser;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.isStaff = raw.isStaff;
    user.isActive = raw.isActive;
    user.username = raw.username;
    user.password = raw.password;
    user.email = raw.email;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.lastLogin = raw.lastLogin;

    return user;
  }
}

export { UsersMapper };
