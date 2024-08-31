export type CredentialEntityType = {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export class CredentialEntity {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(data: CredentialEntityType) {
    this.id = data.id;
    this.username = data.username;
    this.passwordHash = data.passwordHash;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
