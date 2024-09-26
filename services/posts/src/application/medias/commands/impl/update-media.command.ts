
export class UpdateMediaCommand {
  constructor(
    public readonly mediaId: string,
    public readonly dto: {
        url: string;
    },
  ) {}
}