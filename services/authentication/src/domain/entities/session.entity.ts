export type SessionEntityType = {
  id: string;
  credentialId: string;
  token: string;
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  lastActive: Date;
};

export class SessionEntity {
  id: string;
  credentialId: string;
  token: string;
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  lastActive: Date;
  constructor(data: SessionEntityType) {
    this.id = data.id;
    this.credentialId = data.credentialId;
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.createdAt = data.createdAt;
    this.expiresAt = data.expiresAt;
    this.lastActive = data.lastActive;
  }
}
