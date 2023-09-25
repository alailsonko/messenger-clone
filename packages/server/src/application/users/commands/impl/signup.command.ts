import { Prisma } from '@prisma/client';

export class SignUpCommand {
  constructor(public readonly userCreateInput: Prisma.UserCreateInput) {}
}
