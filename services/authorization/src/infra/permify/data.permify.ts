import { Injectable } from '@nestjs/common';
import { base } from '@messenger-clone/rpc/gen/ts/base/v1/service';
import { base as dependency_1 } from '@messenger-clone/rpc/gen/ts/base/v1/base';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class DataPermify {
  private readonly client: base.v1.DataClient;

  constructor() {
    this.client = new base.v1.DataClient(
      'permify:3478',
      grpc.credentials.createInsecure(),
    );
  }

  delete(dto: {
    tenant_id?: string;
    tuple_filter?: dependency_1.v1.TupleFilter;
    attribute_filter?: dependency_1.v1.AttributeFilter;
  }): Promise<base.v1.DataDeleteResponse> {
    const message = new base.v1.DataDeleteRequest(dto);

    return new Promise<base.v1.DataDeleteResponse>((resolve, reject) => {
      this.client.Delete(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  deleteRelationships(dto: {
    tenant_id?: string;
    filter?: dependency_1.v1.TupleFilter;
  }): Promise<base.v1.RelationshipDeleteResponse> {
    const message = new base.v1.RelationshipDeleteRequest(dto);

    return new Promise<base.v1.RelationshipDeleteResponse>(
      (resolve, reject) => {
        this.client.DeleteRelationships(message, (err, response) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
      },
    );
  }

  readAttributes(dto: {
    tenant_id?: string;
    metadata?: base.v1.AttributeReadRequestMetadata;
    filter?: dependency_1.v1.AttributeFilter;
    page_size?: number;
    continuous_token?: string;
  }): Promise<base.v1.AttributeReadResponse> {
    const message = new base.v1.AttributeReadRequest(dto);

    return new Promise<base.v1.AttributeReadResponse>((resolve, reject) => {
      this.client.ReadAttributes(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  readRelationships(dto: {
    tenant_id?: string;
    metadata?: base.v1.RelationshipReadRequestMetadata;
    filter?: dependency_1.v1.TupleFilter;
    page_size?: number;
    continuous_token?: string;
  }): Promise<base.v1.RelationshipReadResponse> {
    const message = new base.v1.RelationshipReadRequest(dto);

    return new Promise<base.v1.RelationshipReadResponse>((resolve, reject) => {
      this.client.ReadRelationships(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  write(dto: {
    tenant_id?: string;
    metadata?: base.v1.DataWriteRequestMetadata;
    tuples?: dependency_1.v1.Tuple[];
    attributes?: dependency_1.v1.Attribute[];
  }): Promise<base.v1.DataWriteResponse> {
    const message = new base.v1.DataWriteRequest(dto);

    return new Promise<base.v1.DataWriteResponse>((resolve, reject) => {
      this.client.Write(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  writeRelationships(dto: {
    tenant_id?: string;
    metadata?: base.v1.RelationshipWriteRequestMetadata;
    tuples?: dependency_1.v1.Tuple[];
  }): Promise<base.v1.RelationshipWriteResponse> {
    const message = new base.v1.RelationshipWriteRequest(dto);

    return new Promise<base.v1.RelationshipWriteResponse>((resolve, reject) => {
      this.client.WriteRelationships(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
