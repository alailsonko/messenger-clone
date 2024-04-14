import { AvatarEntity } from 'src/domain/avatars';

type CreateAvatarParameterType = Pick<AvatarEntity, 'url' | 'userId'>;

export class CreateAvatarCommand {
  constructor(public readonly avatar: CreateAvatarParameterType) {}
}
