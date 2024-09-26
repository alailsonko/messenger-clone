import { Injectable } from '@nestjs/common';
import { base } from '@messenger-clone/rpc/gen/ts/base/v1/service';
import { base as dependency_1 } from '@messenger-clone/rpc/gen/ts/base/v1/base';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class BundlePermify {
  private readonly client: base.v1.BundleClient;

  constructor() {
    this.client = new base.v1.BundleClient(
      'permify:3478',
      grpc.credentials.createInsecure(),
    );
  }

  delete(dto: {
    tenant_id?: string;
    name?: string;
  }): Promise<base.v1.BundleDeleteResponse> {
    const message = new base.v1.BundleDeleteRequest(dto);

    return new Promise<base.v1.BundleDeleteResponse>((resolve, reject) => {
      this.client.Delete(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  read(dto: {
    tenant_id?: string;
    name?: string;
  }): Promise<base.v1.BundleReadResponse> {
    const message = new base.v1.BundleReadRequest(dto);

    return new Promise<base.v1.BundleReadResponse>((resolve, reject) => {
      this.client.Read(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  write(dto: {
    tenant_id?: string;
    bundles?: dependency_1.v1.DataBundle[];
  }): Promise<base.v1.BundleWriteResponse> {
    const message = new base.v1.BundleWriteRequest(dto);

    return new Promise<base.v1.BundleWriteResponse>((resolve, reject) => {
      this.client.Write(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
