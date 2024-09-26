import { auth } from "@messenger-clone/rpc/gen/ts/authentication/authentication";
import { Injectable } from "@nestjs/common";
import { AuthenticationClient } from "src/data/clients/authentication/authentication.client";

@Injectable()
export class UserService {
    constructor(
        private readonly authenticationClient: AuthenticationClient,
    ) {}

    async signUp(data: {
        password: string;
        username: string;
        email: string;
    }) {
        const request = new auth.CreateCredentialRequest(data);
        const response = await this.authenticationClient.createCredential(request);

        return {
            clientId: response.clientId,
        }
    }
}