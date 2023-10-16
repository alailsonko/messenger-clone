import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '../impl';
import { UsersRepository } from 'src/data/repositories/users';
import { CryptographyService } from 'src/infra/cryptography/cryptography.service';
import { UsersEntity } from 'src/domain/users/users.entity';
import { plainToClass } from 'class-transformer';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptographyService: CryptographyService,
  ) {}
  async execute(command: SignUpCommand): Promise<UsersEntity> {
    const { userCreateInput } = command;

    userCreateInput.password_hash = await this.cryptographyService.hash(
      userCreateInput.password_hash,
    );

    const user = await this.usersRepository.create(userCreateInput);

    return plainToClass(UsersEntity, user);
  }
}
