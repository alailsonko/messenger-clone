import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { PassportService } from './passport.service';
import { CryptographyModule } from '../cryptography';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants';
import { DataModule } from 'src/data';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    forwardRef(() => DataModule),
    CryptographyModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, PassportService, JwtService],
  exports: [AuthService, PassportService, JwtService],
})
export class AuthModule {}
