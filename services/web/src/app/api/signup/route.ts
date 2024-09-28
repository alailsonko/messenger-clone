import { cookies } from 'next/headers'
import { orchestrator } from '@messenger-clone/rpc/gen/ts/orchestrator/orchestrator'
import * as grpc from '@grpc/grpc-js'

export async function POST(req: Request){
    const data = await req.json(); 

    const signUpRequest = new orchestrator.SignUpRequest({
        username: data.username,
        email: data.email,
        password: data.password,
    });

    const client = new orchestrator.OrchestratorServiceClient('orchestrator:8080', grpc.credentials.createInsecure());

    await new Promise((resolve, reject) => {
        client.waitForReady(Date.now() + 10000, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve('ok');
            }
        });
    })

    const response = await new Promise<orchestrator.SignUpResponse>((resolve, reject) => {
        client.signUp(signUpRequest, (error, response) => {
            if (error) {
                reject(error);
            } else {
                if (!response) {
                    return reject(new Error('No response'));
                }
                resolve(response);
            }
        });
    });

    client.close();

    const cookieStore = cookies();

    cookieStore.set({
        name: 'access-token',
        value: response.accessToken,
        secure: true,
        httpOnly: true,
        path: '/api',
        sameSite: 'strict',
        expires: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes
    });
    cookieStore.set({
        name: 'refresh-token',
        value: response.refreshToken,
        secure: true,
        httpOnly: true,
        path: '/api',
        sameSite: 'strict',
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    return new Response('{ "ok": "ok" }', {
        status: 200,
        headers: {
            'Set-Cookie': cookieStore.toString(),
        },
    });
}