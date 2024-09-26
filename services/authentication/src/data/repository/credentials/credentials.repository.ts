import { Injectable } from '@nestjs/common';
import { Prisma, Credential } from '../../../../prisma/client/prisma';
import { PrismaService } from 'src/infra/database/postgresql/prisma.service';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createCredential(
    data: Prisma.CredentialCreateInput,
  ): Promise<Credential> {
    return this.prismaService.credential.create({
      data,
    });
  }

  async updateCredential(
    where: Prisma.CredentialWhereUniqueInput,
    data: Prisma.CredentialUpdateInput,
  ): Promise<Credential> {
    return this.prismaService.credential.update({
      where,
      data,
    });
  }

  async deleteCredential(
    where: Prisma.CredentialWhereUniqueInput,
  ): Promise<Credential> {
    return this.prismaService.credential.delete({
      where,
    });
  }

  async findCredential(
    where: Prisma.CredentialWhereUniqueInput,
  ): Promise<Credential> {
    return this.prismaService.credential.findUnique({
      where,
    });
  }
}
