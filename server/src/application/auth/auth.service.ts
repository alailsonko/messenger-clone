import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser, UsersModel } from 'src/domain/users';
import { jwtConstants } from './auth.constants';
import { AuthenticatePayload } from './auth.types';
import { UsersMapper } from 'src/domain/users/users.mapper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UsersModel | null> {
    const user = await this.usersService.findUniqueUser(
      { email },
      {
        groups: true,
        permissions: true,
      },
    );

    if (user && user.password === pass) {
      user.password = null;

      return user;
    }

    return null;
  }

  async userWithGroupsAndPermissions(id: string): Promise<IUser> {
    const user = await this.usersService.findUniqueUser(
      { id },
      {
        permissions: true,
        groups: true,
      },
    );

    return UsersMapper.toObject(user);
  }

  async createAccessToken(user: UsersModel) {
    const payload: AuthenticatePayload = {
      email: user.email,
      id: user.id,
      groups: user.groups.length ? user.groups.map((group) => group.id) : [],
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: jwtConstants.secret,
    });
  }

  async createRefreshToken(user: UsersModel) {
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

  async login(user: UsersModel) {
    return {
      accessToken: await this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(user),
    };
  }
}
