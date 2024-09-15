import { Injectable } from '@nestjs/common';
import { base } from './generated/ts/base/v1/service';
import { base as dependency_1 } from './generated/ts/base/v1/base';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class SchemaPermify {
  private readonly client: base.v1.SchemaClient;

  constructor() {
    this.client = new base.v1.SchemaClient(
      'permify:3478',
      grpc.credentials.createInsecure(),
    );
  }

  list(dto: {
    tenant_id?: string;
    page_size?: number;
    continuous_token?: string;
  }): Promise<base.v1.SchemaListResponse> {
    const message = new base.v1.SchemaListRequest(dto);

    return new Promise<base.v1.SchemaListResponse>((resolve, reject) => {
      this.client.List(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  partialWrite(dto: {
    tenant_id?: string;
    metadata?: base.v1.SchemaPartialWriteRequestMetadata;
    partials?: Map<string, dependency_1.v1.Partials>;
  }): Promise<base.v1.SchemaPartialWriteResponse> {
    const message = new base.v1.SchemaPartialWriteRequest(dto);

    return new Promise<base.v1.SchemaPartialWriteResponse>(
      (resolve, reject) => {
        this.client.PartialWrite(message, (err, response) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
      },
    );
  }

  read(dto: {
    tenant_id?: string;
    metadata?: base.v1.SchemaReadRequestMetadata;
  }): Promise<base.v1.SchemaReadResponse> {
    const message = new base.v1.SchemaReadRequest(dto);

    return new Promise<base.v1.SchemaReadResponse>((resolve, reject) => {
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
    schema?: string;
  }): Promise<base.v1.SchemaWriteResponse> {
    const message = new base.v1.SchemaWriteRequest(dto);

    return new Promise<base.v1.SchemaWriteResponse>((resolve, reject) => {
      this.client.Write(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
