import { CommandHandler } from "@nestjs/cqrs";
import { CreateMediaCommand } from "../impl";
import { MediasRepository } from "src/data/repository/medias.repository";

@CommandHandler(CreateMediaCommand)
export class CreateMediaHandler {
  constructor(
    private readonly mediasRepository: MediasRepository
  ) {}
  async execute(command: CreateMediaCommand) {
    return await this.mediasRepository.createMedia({
        url: command.dto.url,
        type: command.dto.type,
        post: {
            connect: {
                id: command.dto.postId
            }
        }
    });
  }
}