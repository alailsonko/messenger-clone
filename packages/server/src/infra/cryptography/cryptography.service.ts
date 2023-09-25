import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptographyService {
  constructor() {}
  hash(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  compareHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
