import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../auth.constants';
import { AuthenticatePayload } from '../auth.types';
import { AuthService } from '../auth.service';
import { IUser } from 'src/domain/users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['accessToken'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: AuthenticatePayload): Promise<IUser> {
    return this.authService.userWithGroupsAndPermissions(payload.id);
  }
}
