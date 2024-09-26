import { UpdateCommentHandler } from "src/application/comments/commands/handlers/update-comment.handler";
import { CreateMediaHandler } from "./create-media.handler";
import { DeleteMediaHandler } from "./delete-media.handler";

export const CommandHandlers =[
    CreateMediaHandler,
    DeleteMediaHandler,
    UpdateCommentHandler,
]
