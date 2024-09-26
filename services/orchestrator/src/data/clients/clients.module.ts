import { Module } from "@nestjs/common";
import { AuthenticationClient } from "./authentication/authentication.client";

@Module({
    providers: [AuthenticationClient],
    exports: [AuthenticationClient],
})
export class ClientsModule {}
