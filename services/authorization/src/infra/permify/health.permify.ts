import { Injectable } from '@nestjs/common';
import { base } from './generated/ts/base/v1/service';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class HealthPermify {
  private readonly client: base.v1.HealthClient;

  constructor() {
    this.client = new base.v1.HealthClient(
      'permify:3478',
      grpc.credentials.createInsecure(),
    );
  }

  check(dto: {
    tenant_id?: string;
    name?: string;
  }): Promise<base.v1.HealthResponse> {
    const message = new base.v1.HealthRequest(dto);

    return new Promise<base.v1.HealthResponse>((resolve, reject) => {
      this.client.Check(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
