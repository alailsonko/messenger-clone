export class CreateCommentDto {
  postId: string;
  content: string;
  userId: string;
}

export class CreateCommentCommand {
  constructor(public readonly data: CreateCommentDto) {}
}
