export interface ISession {
  id: string;
  sessionKey: string;
  sessionData: string;
  expireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
