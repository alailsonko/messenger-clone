import { CommandHandler } from "@nestjs/cqrs";
import { DeleteMediaCommand } from "../impl";
import { MediasRepository } from "src/data/repository/medias.repository";

@CommandHandler(DeleteMediaCommand)
export class DeleteMediaHandler {
  constructor(
    private readonly mediasRepository: MediasRepository
  ) {}
  async execute(command: DeleteMediaCommand) {
    return await this.mediasRepository.deleteMedia({
        id: command.mediaId
    });
  }
}
