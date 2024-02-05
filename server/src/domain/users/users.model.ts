import { createHmac } from 'node:crypto';
import { UsersEntity } from './users.entity';

class UserModel extends UsersEntity {
  constructor() {
    super();
  }

  getUsername(): string {
    return super.username;
  }

  getFullName(): string {
    return `${super.firstName} ${super.lastName}`;
  }

  getShortName(): string {
    return super.firstName;
  }

  setPassword(rawPassword: string | null): void {
    if (rawPassword === null) {
      super.password = '';
    } else {
      const hash = createHmac('sha256', rawPassword).digest('hex');
      super.password = hash;
    }
  }

  checkPassword(rawPassword: string): boolean {
    const hash = createHmac('sha256', rawPassword).digest('hex');
    return super.password === hash;
  }

  setUnusablePassword(): void {
    super.password = '';
  }

  hasUsablePassword(): boolean {
    return super.password !== '';
  }

  getUserPermissions(): any[] {
    return super.userPermissions;
  }

  getGroupPermissions(): any[] {
    return super.userGroup;
  }

  getAllPermissions(): any[] {
    return [...super.userPermissions, ...super.userGroup];
  }

  hasPerm(perm: string): boolean {
    return this.getAllPermissions().includes(perm);
  }

  hasPerms(permList: string[]): boolean {
    return permList.every((perm) => this.hasPerm(perm));
  }

  hasModulePerms(packageName: string): boolean {
    if (!super.isActive) {
      return false;
    }

    if (super.isSuperUser) {
      return true;
    }

    const userHasPermissionInPackage = this.getAllPermissions().some(
      (permission) => permission.startsWith(packageName),
    );

    return userHasPermissionInPackage;
  }

  emailUser(
    subject: string,
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _fromEmail: string = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _kwargs: any,
  ): void {
    console.log('Emailing user');
  }
}

export { UserModel };
