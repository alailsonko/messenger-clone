import { CreateUserParameterType } from '../types/create-user.types';

export class CreateUserCommand {
  constructor(public readonly user: CreateUserParameterType) {}
}
