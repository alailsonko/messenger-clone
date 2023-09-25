import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '../impl';
import { UsersRepository } from 'src/data/repositories/users';
import { Prisma } from '@prisma/client';
import { CryptographyService } from 'src/infra/cryptography/cryptography.service';
import { UsersEntity } from 'src/domain/users/users.model';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}
  async execute(
    command: SignUpCommand,
  ): Promise<Prisma.Prisma__UserClient<UsersEntity>> {
    const { userCreateInput } = command;

    userCreateInput.password_hash = await this.cryptographyService.hash(
      userCreateInput.password_hash,
    );

    const user = await this.usersRepository.create(userCreateInput);

    return user;
  }
}
