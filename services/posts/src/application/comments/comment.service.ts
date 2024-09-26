import { CommandBus, QueryBus } from '@nestjs/cqrs';

export class CommentsApplicationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
}
