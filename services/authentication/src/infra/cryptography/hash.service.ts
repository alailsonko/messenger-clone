import { Injectable } from '@nestjs/common';
import { randomBytes, pbkdf2 } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

@Injectable()
export class HashService {
  private readonly minIterations = 100000;
  private readonly maxIterations = 200000;
  private readonly keyLength = 64;
  private readonly digest = 'sha512';

  private getRandomIterations(): number {
    return (
      Math.floor(
        Math.random() * (this.maxIterations - this.minIterations + 1),
      ) + this.minIterations
    );
  }

  async hash(value: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const iterations = this.getRandomIterations();
    const hashedValue = await pbkdf2Async(
      value,
      salt,
      iterations,
      this.keyLength,
      this.digest,
    );
    return `${salt}$${iterations}$${hashedValue.toString('hex')}`;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const [salt, iterations, hashedPassword] = hash.split('$');
    const hashedValue = await pbkdf2Async(
      value,
      salt,
      parseInt(iterations, 10),
      this.keyLength,
      this.digest,
    );
    return hashedValue.toString('hex') === hashedPassword;
  }
}
