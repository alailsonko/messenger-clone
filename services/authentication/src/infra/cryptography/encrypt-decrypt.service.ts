import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class EncryptDecryptService {
  private publicKey: string;
  private privateKey: string;

  constructor() {
    this.loadKeys();
  }

  private async loadKeys(): Promise<void> {
    this.publicKey = await fs.readFile(
      path.resolve(__dirname, '../../../private/public-rsa.key'),
      'utf8',
    );
    this.privateKey = await fs.readFile(
      path.resolve(__dirname, '../../../private/private-rsa.key'),
      'utf8',
    );
  }

  async encrypt(data: string): Promise<string> {
    await this.ensureKeysLoaded();

    const symmetricKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
    let encryptedData = cipher.update(data, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    const encryptedSymmetricKey = crypto.publicEncrypt(
      {
        key: this.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      symmetricKey,
    );

    return `${iv.toString('base64')}:${encryptedSymmetricKey.toString('base64')}:${encryptedData}`;
  }

  async decrypt(data: string): Promise<string> {
    await this.ensureKeysLoaded();

    const [ivBase64, encryptedSymmetricKeyBase64, encryptedData] =
      data.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const encryptedSymmetricKey = Buffer.from(
      encryptedSymmetricKeyBase64,
      'base64',
    );

    const symmetricKey = crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      encryptedSymmetricKey,
    );

    const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);
    let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }

  private async ensureKeysLoaded(): Promise<void> {
    if (!this.publicKey || !this.privateKey) {
      await this.loadKeys();
    }
  }
}
