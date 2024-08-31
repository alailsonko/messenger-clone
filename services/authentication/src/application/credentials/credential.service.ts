import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateCredentialCommand,
  ValidateCredentialCommand,
} from './commands/impl';
import { CreateCredentialDto } from 'src/presentation/authentication/dto/create-credential.dto';
import { FindCredentialQuery } from './queries/impl';
import { CredentialModel } from 'src/domain/models/credential.model';
import { CredentialEntityType } from 'src/domain/entities/credential.entity';
import { ValidateCredentialDto } from 'src/presentation/authentication/dto/validate-credential.dto';

@Injectable()
export class CredentialsApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createCredential(data: CreateCredentialDto) {
    return this.commandBus.execute(new CreateCredentialCommand(data));
  }

  async findCredential(id: string): Promise<CredentialEntityType> {
    const model = await this.queryBus.execute<
      FindCredentialQuery,
      CredentialModel
    >(new FindCredentialQuery({ id }));

    return model.toEntity();
  }

  async validateCredential(data: ValidateCredentialDto) {
    return this.commandBus.execute<ValidateCredentialCommand, boolean>(
      new ValidateCredentialCommand(data),
    );
  }
}
