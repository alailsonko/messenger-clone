import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/data/repositories/users';
import { CryptographyService } from '../cryptography/cryptography.service';
import { JwtService } from '@nestjs/jwt';
import { UsersAttrs } from 'src/domain/users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptographyService: CryptographyService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<UsersAttrs, 'password_hash'>> {
    const { password_hash, ...result } = await this.usersRepository.findUnique({
      email,
    });
    const isValid = await this.cryptographyService.compareHash(
      pass,
      password_hash,
    );
    if (isValid) {
      return result;
    }
    return null;
  }

  async login(user: { id: string; username: string; email: string }) {
    return {
      access_token: this.jwtService.sign(
        {
          email: user.email,
          id: user.id,
          username: user.username,
        },
        {
          expiresIn: '1d',
        },
      ),
    };
  }
}
