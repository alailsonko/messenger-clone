import { Injectable } from '@nestjs/common';
import { base } from './generated/ts/base/v1/service';
import { base as dependency_1 } from './generated/ts/base/v1/base';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class WatchPermify {
  private readonly client: base.v1.WatchClient;

  constructor() {
    this.client = new base.v1.WatchClient(
      'permify:3478',
      grpc.credentials.createInsecure(),
    );
  }

  delete(dto: {
    tenant_id?: string;
    snap_token?: string;
  }): Promise<base.v1.DataDeleteResponse> {
    const message = new base.v1.WatchRequest(dto);

    const metadata = new grpc.Metadata();

    return new Promise<base.v1.DataDeleteResponse>((resolve, reject) => {
      const response = this.client.Watch(message, metadata);

      response.on('data', (data) => {
        console.log('Data:', data);
      });

      response.on('end', () => {
        console.log('End');
      });

      response.on('error', (err) => {
        console.log('Error:', err);
      });

      response.on('status', (status) => {
        console.log('Status:', status);
      });
    });
  }
}
