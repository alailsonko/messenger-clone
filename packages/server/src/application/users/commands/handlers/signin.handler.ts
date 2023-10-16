import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from '../impl';
import { AuthService } from 'src/infra/auth/auth.service';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(private readonly authService: AuthService) {}
  async execute(command: SignInCommand): Promise<{
    access_token: string;
  }> {
    const { user } = command;

    return this.authService.login(user);
  }
}
