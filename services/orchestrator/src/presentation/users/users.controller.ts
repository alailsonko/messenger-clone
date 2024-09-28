import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { UserService } from "src/application/users/users.service";
import { OrchestratorMethods, ProtobufServiceNames } from "../rpc/protobuf-packages";
import { orchestrator } from '@messenger-clone/rpc/gen/ts/orchestrator/orchestrator';

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UserService
    ) {
    }

    @GrpcMethod(
        ProtobufServiceNames.ORCHESTRATOR,
        OrchestratorMethods.SIGN_UP
    )
    async signUp(
        data: orchestrator.SignUpRequest
    ) {
        const response = await this.usersService.signUp(data);

        return new orchestrator.SignUpResponse({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
        });
    }
}
