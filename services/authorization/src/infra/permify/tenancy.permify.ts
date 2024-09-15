import { Injectable } from '@nestjs/common';
import { base } from './generated/ts/base/v1/service';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class TenancyPermify {
  private readonly client: base.v1.TenancyClient;

  constructor() {
    this.client = new base.v1.TenancyClient(
      'permify:3478',
      grpc.credentials.createInsecure(),
    );
  }

  create(dto: {
    id: string;
    name: string;
  }): Promise<base.v1.TenantCreateResponse> {
    const message = new base.v1.TenantCreateRequest(dto);

    return new Promise<base.v1.TenantCreateResponse>((resolve, reject) => {
      this.client.Create(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  delete(dto: { id: string }): Promise<base.v1.TenantDeleteResponse> {
    const message = new base.v1.TenantDeleteRequest(dto);

    return new Promise<base.v1.TenantDeleteResponse>((resolve, reject) => {
      this.client.Delete(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  list(dto: {
    page_size?: number;
    continuous_token?: string;
  }): Promise<base.v1.TenantListResponse> {
    const message = new base.v1.TenantListRequest(dto);

    return new Promise<base.v1.TenantListResponse>((resolve, reject) => {
      this.client.List(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
