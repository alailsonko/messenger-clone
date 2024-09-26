export class CreateMediaCommand {
  constructor(public readonly dto: {
    postId: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
  }) {}
}
