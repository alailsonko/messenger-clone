import { AvatarEntity } from 'src/domain/avatars';

type UpdateAvatarParameterType = Pick<AvatarEntity, 'url' | 'userId'>;

export class UpdateAvatarCommand {
  constructor(public readonly avatar: UpdateAvatarParameterType) {}
}
