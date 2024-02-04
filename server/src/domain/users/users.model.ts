import { createHmac } from 'node:crypto';
import { UsersEntity } from './users.entity';

class UserModel extends UsersEntity {
  constructor() {
    super();
  }

  get id(): string {
    return super.id;
  }

  set id(value: string) {
    super.id = value;
  }

  get username(): string {
    return super.username;
  }

  set username(value: string) {
    super.username = value;
  }

  get password(): string {
    return super.password;
  }

  set password(value: string) {
    super.password = value;
  }

  get email(): string {
    return super.email;
  }

  set email(value: string) {
    super.email = value;
  }

  get createdAt(): Date {
    return super.createdAt;
  }

  set createdAt(value: Date) {
    super.createdAt = value;
  }

  get updatedAt(): Date {
    return super.updatedAt;
  }

  set updatedAt(value: Date) {
    super.updatedAt = value;
  }

  get lastLogin(): Date | null {
    return super.lastLogin;
  }

  set lastLogin(value: Date | null) {
    super.lastLogin = value;
  }

  get isSuperUser(): boolean {
    return super.isSuperUser;
  }

  set isSuperUser(value: boolean) {
    super.isSuperUser = value;
  }

  get firstName(): string {
    return super.firstName;
  }

  set firstName(value: string) {
    super.firstName = value;
  }

  get lastName(): string {
    return super.lastName;
  }

  set lastName(value: string) {
    super.lastName = value;
  }

  get isStaff(): boolean {
    return super.isStaff;
  }

  set isStaff(value: boolean) {
    super.isStaff = value;
  }

  get isActive(): boolean {
    return super.isActive;
  }

  set isActive(value: boolean) {
    super.isActive = value;
  }

  get userPermissions(): any[] {
    return super.userPermissions;
  }

  set userPermissions(value: any[]) {
    super.userPermissions = value;
  }

  get userGroup(): any[] {
    return super.userGroup;
  }

  set userGroup(value: any[]) {
    super.userGroup = value;
  }

  get adminLog(): any[] {
    return super.adminLog;
  }

  set adminLog(value: any[]) {
    super.adminLog = value;
  }

  getUsername(): string {
    return this.username;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getShortName(): string {
    return this.firstName;
  }

  setPassword(rawPassword: string | null): void {
    if (rawPassword === null) {
      this.password = '';
    } else {
      const hash = createHmac('sha256', rawPassword).digest('hex');
      this.password = hash;
    }
  }

  checkPassword(rawPassword: string): boolean {
    const hash = createHmac('sha256', rawPassword).digest('hex');
    return this.password === hash;
  }

  setUnusablePassword(): void {
    this.password = '';
  }

  hasUsablePassword(): boolean {
    return this.password !== '';
  }

  getUserPermissions(): any[] {
    return this.userPermissions;
  }

  getGroupPermissions(): any[] {
    return this.userGroup;
  }

  getAllPermissions(): any[] {
    return [...this.userPermissions, ...this.userGroup];
  }

  hasPerm(perm: string): boolean {
    return this.getAllPermissions().includes(perm);
  }

  hasPerms(permList: string[]): boolean {
    return permList.every((perm) => this.hasPerm(perm));
  }

  hasModulePerms(packageName: string): boolean {
    if (!this.isActive) {
      return false;
    }

    if (this.isSuperUser) {
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
