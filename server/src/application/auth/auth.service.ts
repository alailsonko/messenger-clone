import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser, UsersEntity, UsersModel } from 'src/domain/users';
import { jwtConstants } from './auth.constants';
import { AuthenticatePayload } from './auth.types';
import { FindUniqueUserQuery } from '../users/queries/impl';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private queryBus: QueryBus,
  ) {}

  async validateUser(email: string, pass: string): Promise<UsersModel | null> {
    const user = await this.queryBus.execute<FindUniqueUserQuery, UsersModel>(
      new FindUniqueUserQuery(
        { email },
        {
          permissions: true,
          groups: true,
        },
      ),
    );

    if (user && user.password === pass) {
      user.password = null;

      return user;
    }

    return null;
  }

  async userWithGroupsAndPermissions(id: string): Promise<IUser> {
    const user = await this.queryBus.execute<FindUniqueUserQuery, UsersModel>(
      new FindUniqueUserQuery(
        { id },
        {
          permissions: true,
          groups: true,
        },
      ),
    );

    return UsersEntity.create(user).toObject();
  }

  async createAccessToken(user: IUser) {
    const payload: AuthenticatePayload = {
      email: user.email,
      id: user.id,
      groups: user.groups.length ? user.groups.map((group) => group.id) : [],
    };

    return this.jwtService.sign(payload, {
      expiresIn: '5h',
      secret: jwtConstants.secret,
    });
  }

  async createRefreshToken(user: IUser) {
    const payload: AuthenticatePayload = {
      email: user.email,
      id: user.id,
      groups: user.groups.length ? user.groups.map((group) => group.id) : [],
    };

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: jwtConstants.secret,
    });
  }

  async login(user: IUser) {
    return {
      accessToken: await this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(user),
    };
  }
}
