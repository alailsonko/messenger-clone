import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
class UsersService {
  constructor(private commandBus: CommandBus) {}
}

export { UsersService };
