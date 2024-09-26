import { CommandHandler } from "@nestjs/cqrs";
import { UpdateMediaCommand } from "../impl";
import { MediasRepository } from "src/data/repository/medias.repository";

@CommandHandler(UpdateMediaCommand)
export class UpdateMediaHandler {
  constructor(
    private readonly mediasRepository: MediasRepository
  ) {}
  async execute(command: UpdateMediaCommand) {
    return await this.mediasRepository.updateMedia(
      {
        id: command.mediaId,
      },
      {
        url: command.dto.url,
      }
    );
  }
}