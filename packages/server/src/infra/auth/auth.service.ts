import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/data/repositories/users';
import { CryptographyService } from '../cryptography/cryptography.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

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
  ): Promise<
    Prisma.Prisma__UserClient<{
      id: string;
      username: string;
      email: string;
      profile_image_url: string;
      created_at: Date;
      updated_at: Date;
    }>
  > {
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
    const payload = {
      email: user.email,
      id: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
