import { Injectable } from '@nestjs/common';
import { base } from './generated/ts/base/v1/service';
import { base as dependency_1 } from './generated/ts/base/v1/base';
import * as grpc from '@grpc/grpc-js';

@Injectable()
export class PermissionPermify {
  private readonly client: base.v1.PermissionClient;

  constructor() {
    this.client = new base.v1.PermissionClient(
      'permify:3478',
      grpc.credentials.createInsecure(),
    );
  }

  check(dto: {
    tenant_id?: string;
    metadata?: base.v1.PermissionCheckRequestMetadata;
    entity?: dependency_1.v1.Entity;
    permission?: string;
    subject?: dependency_1.v1.Subject;
    context?: dependency_1.v1.Context;
    arguments?: dependency_1.v1.Argument[];
  }): Promise<base.v1.PermissionCheckResponse> {
    const message = new base.v1.PermissionCheckRequest(dto);

    return new Promise<base.v1.PermissionCheckResponse>((resolve, reject) => {
      this.client.Check(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  expand(dto: {
    tenant_id?: string;
    metadata?: base.v1.PermissionExpandRequestMetadata;
    entity?: dependency_1.v1.Entity;
    permission?: string;
    context?: dependency_1.v1.Context;
    arguments?: dependency_1.v1.Argument[];
  }): Promise<base.v1.PermissionExpandResponse> {
    const message = new base.v1.PermissionExpandRequest(dto);

    return new Promise<base.v1.PermissionExpandResponse>((resolve, reject) => {
      this.client.Expand(message, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  lookupEntity(dto: {
    page_size?: number;
    continuous_token?: string;
  }): Promise<base.v1.PermissionLookupEntityResponse> {
    const message = new base.v1.PermissionLookupEntityRequest(dto);

    return new Promise<base.v1.PermissionLookupEntityResponse>(
      (resolve, reject) => {
        this.client.LookupEntity(message, (err, response) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
      },
    );
  }

  lookupEntityStream(dto: {
    tenant_id?: string;
    metadata?: base.v1.PermissionLookupEntityRequestMetadata;
    entity_type?: string;
    permission?: string;
    subject?: dependency_1.v1.Subject;
    context?: dependency_1.v1.Context;
    page_size?: number;
    continuous_token?: string;
  }): Promise<base.v1.PermissionLookupEntityStreamResponse> {
    const message = new base.v1.PermissionLookupEntityRequest(dto);

    const metadata = new grpc.Metadata();

    return new Promise<base.v1.PermissionLookupEntityStreamResponse>(
      (resolve, reject) => {
        const response = this.client.LookupEntityStream(
          message,
          metadata,
          undefined,
        );

        const data: any = [];

        response.on('data', (data) => {
          data.push(data);
        });

        response.on('error', (err) => {
          reject(err);
        });

        response.on('end', () => {
          resolve(data);
        });
      },
    );
  }

  lookupSubject(dto: {
    tenant_id?: string;
    metadata?: base.v1.PermissionLookupSubjectRequestMetadata;
    entity?: dependency_1.v1.Entity;
    permission?: string;
    subject_reference?: dependency_1.v1.RelationReference;
    context?: dependency_1.v1.Context;
    page_size?: number;
    continuous_token?: string;
  }): Promise<base.v1.PermissionLookupSubjectResponse> {
    const message = new base.v1.PermissionLookupSubjectRequest(dto);

    return new Promise<base.v1.PermissionLookupSubjectResponse>(
      (resolve, reject) => {
        this.client.LookupSubject(message, (err, response) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
      },
    );
  }

  subjectPermission(dto: {
    tenant_id?: string;
    metadata?: base.v1.PermissionSubjectPermissionRequestMetadata;
    entity?: dependency_1.v1.Entity;
    subject?: dependency_1.v1.Subject;
    context?: dependency_1.v1.Context;
  }): Promise<base.v1.PermissionSubjectPermissionResponse> {
    const message = new base.v1.PermissionSubjectPermissionRequest(dto);

    return new Promise<base.v1.PermissionSubjectPermissionResponse>(
      (resolve, reject) => {
        this.client.SubjectPermission(message, (err, response) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
      },
    );
  }
}
