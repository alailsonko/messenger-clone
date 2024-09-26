export class UpdateCommentDto {
  content: string;
}

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly data: UpdateCommentDto,
  ) {}
}
