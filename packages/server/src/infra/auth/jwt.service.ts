import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/common/constants';
import { UsersRepository } from 'src/data/repositories/users';

@Injectable()
export class JwtService extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: { email: string; id: string; username: string }) {
    return this.usersRepository.findUnique({
      email: payload.email,
      id: payload.id,
    });
  }
}
