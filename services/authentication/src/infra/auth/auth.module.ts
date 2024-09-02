import { Module, Global } from '@nestjs/common';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { readFile } from 'fs/promises';
import { join } from 'path';

const jwtModuleConfig: JwtModuleAsyncOptions = {
  useFactory: async () => ({
    secretOrKeyProvider: async (requestType, tokenOrPayload, options) => {
      const privateKey = await readFile(
        join(__dirname, '../../../private/private.key'),
        'utf8',
      );
      return privateKey;
    },
    verifyOptions: {
      algorithms: ['ES256'],
      audience: 'authentication',
      issuer: 'authentication',
    },
    signOptions: {
      expiresIn: '180s',
      algorithm: 'ES256',
      audience: 'authentication',
      issuer: 'authentication',
    },
  }),
};

@Global()
@Module({
  imports: [JwtModule.registerAsync(jwtModuleConfig)],
  exports: [JwtModule],
})
export class JwtAuthModule {}
