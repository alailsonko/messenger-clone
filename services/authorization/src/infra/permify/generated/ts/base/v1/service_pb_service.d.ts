// package: base.v1
// file: base/v1/service.proto

import * as base_v1_service_pb from '../../base/v1/service_pb';
import { grpc } from '@improbable-eng/grpc-web';

type HealthCheck = {
  readonly methodName: string;
  readonly service: typeof Health;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.HealthRequest;
  readonly responseType: typeof base_v1_service_pb.HealthResponse;
};

export class Health {
  static readonly serviceName: string;
  static readonly Check: HealthCheck;
}

type PermissionCheck = {
  readonly methodName: string;
  readonly service: typeof Permission;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.PermissionCheckRequest;
  readonly responseType: typeof base_v1_service_pb.PermissionCheckResponse;
};

type PermissionExpand = {
  readonly methodName: string;
  readonly service: typeof Permission;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.PermissionExpandRequest;
  readonly responseType: typeof base_v1_service_pb.PermissionExpandResponse;
};

type PermissionLookupEntity = {
  readonly methodName: string;
  readonly service: typeof Permission;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.PermissionLookupEntityRequest;
  readonly responseType: typeof base_v1_service_pb.PermissionLookupEntityResponse;
};

type PermissionLookupEntityStream = {
  readonly methodName: string;
  readonly service: typeof Permission;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof base_v1_service_pb.PermissionLookupEntityRequest;
  readonly responseType: typeof base_v1_service_pb.PermissionLookupEntityStreamResponse;
};

type PermissionLookupSubject = {
  readonly methodName: string;
  readonly service: typeof Permission;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.PermissionLookupSubjectRequest;
  readonly responseType: typeof base_v1_service_pb.PermissionLookupSubjectResponse;
};

type PermissionSubjectPermission = {
  readonly methodName: string;
  readonly service: typeof Permission;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.PermissionSubjectPermissionRequest;
  readonly responseType: typeof base_v1_service_pb.PermissionSubjectPermissionResponse;
};

export class Permission {
  static readonly serviceName: string;
  static readonly Check: PermissionCheck;
  static readonly Expand: PermissionExpand;
  static readonly LookupEntity: PermissionLookupEntity;
  static readonly LookupEntityStream: PermissionLookupEntityStream;
  static readonly LookupSubject: PermissionLookupSubject;
  static readonly SubjectPermission: PermissionSubjectPermission;
}

type WatchWatch = {
  readonly methodName: string;
  readonly service: typeof Watch;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof base_v1_service_pb.WatchRequest;
  readonly responseType: typeof base_v1_service_pb.WatchResponse;
};

export class Watch {
  static readonly serviceName: string;
  static readonly Watch: WatchWatch;
}

type SchemaWrite = {
  readonly methodName: string;
  readonly service: typeof Schema;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.SchemaWriteRequest;
  readonly responseType: typeof base_v1_service_pb.SchemaWriteResponse;
};

type SchemaPartialWrite = {
  readonly methodName: string;
  readonly service: typeof Schema;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.SchemaPartialWriteRequest;
  readonly responseType: typeof base_v1_service_pb.SchemaPartialWriteResponse;
};

type SchemaRead = {
  readonly methodName: string;
  readonly service: typeof Schema;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.SchemaReadRequest;
  readonly responseType: typeof base_v1_service_pb.SchemaReadResponse;
};

type SchemaList = {
  readonly methodName: string;
  readonly service: typeof Schema;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.SchemaListRequest;
  readonly responseType: typeof base_v1_service_pb.SchemaListResponse;
};

export class Schema {
  static readonly serviceName: string;
  static readonly Write: SchemaWrite;
  static readonly PartialWrite: SchemaPartialWrite;
  static readonly Read: SchemaRead;
  static readonly List: SchemaList;
}

type DataWrite = {
  readonly methodName: string;
  readonly service: typeof Data;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.DataWriteRequest;
  readonly responseType: typeof base_v1_service_pb.DataWriteResponse;
};

type DataWriteRelationships = {
  readonly methodName: string;
  readonly service: typeof Data;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.RelationshipWriteRequest;
  readonly responseType: typeof base_v1_service_pb.RelationshipWriteResponse;
};

type DataReadRelationships = {
  readonly methodName: string;
  readonly service: typeof Data;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.RelationshipReadRequest;
  readonly responseType: typeof base_v1_service_pb.RelationshipReadResponse;
};

type DataReadAttributes = {
  readonly methodName: string;
  readonly service: typeof Data;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.AttributeReadRequest;
  readonly responseType: typeof base_v1_service_pb.AttributeReadResponse;
};

type DataDelete = {
  readonly methodName: string;
  readonly service: typeof Data;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.DataDeleteRequest;
  readonly responseType: typeof base_v1_service_pb.DataDeleteResponse;
};

type DataDeleteRelationships = {
  readonly methodName: string;
  readonly service: typeof Data;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.RelationshipDeleteRequest;
  readonly responseType: typeof base_v1_service_pb.RelationshipDeleteResponse;
};

export class Data {
  static readonly serviceName: string;
  static readonly Write: DataWrite;
  static readonly WriteRelationships: DataWriteRelationships;
  static readonly ReadRelationships: DataReadRelationships;
  static readonly ReadAttributes: DataReadAttributes;
  static readonly Delete: DataDelete;
  static readonly DeleteRelationships: DataDeleteRelationships;
}

type BundleWrite = {
  readonly methodName: string;
  readonly service: typeof Bundle;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.BundleWriteRequest;
  readonly responseType: typeof base_v1_service_pb.BundleWriteResponse;
};

type BundleRead = {
  readonly methodName: string;
  readonly service: typeof Bundle;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.BundleReadRequest;
  readonly responseType: typeof base_v1_service_pb.BundleReadResponse;
};

type BundleDelete = {
  readonly methodName: string;
  readonly service: typeof Bundle;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.BundleDeleteRequest;
  readonly responseType: typeof base_v1_service_pb.BundleDeleteResponse;
};

export class Bundle {
  static readonly serviceName: string;
  static readonly Write: BundleWrite;
  static readonly Read: BundleRead;
  static readonly Delete: BundleDelete;
}

type TenancyCreate = {
  readonly methodName: string;
  readonly service: typeof Tenancy;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.TenantCreateRequest;
  readonly responseType: typeof base_v1_service_pb.TenantCreateResponse;
};

type TenancyDelete = {
  readonly methodName: string;
  readonly service: typeof Tenancy;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.TenantDeleteRequest;
  readonly responseType: typeof base_v1_service_pb.TenantDeleteResponse;
};

type TenancyList = {
  readonly methodName: string;
  readonly service: typeof Tenancy;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof base_v1_service_pb.TenantListRequest;
  readonly responseType: typeof base_v1_service_pb.TenantListResponse;
};

export class Tenancy {
  static readonly serviceName: string;
  static readonly Create: TenancyCreate;
  static readonly Delete: TenancyDelete;
  static readonly List: TenancyList;
}

export type ServiceError = {
  message: string;
  code: number;
  metadata: grpc.Metadata;
};
export type Status = { details: string; code: number; metadata: grpc.Metadata };

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(
    type: 'data',
    handler: (message: ResT) => void,
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'end',
    handler: (status?: Status) => void,
  ): BidirectionalStream<ReqT, ResT>;
  on(
    type: 'status',
    handler: (status: Status) => void,
  ): BidirectionalStream<ReqT, ResT>;
}

export class HealthClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  check(
    requestMessage: base_v1_service_pb.HealthRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.HealthResponse | null,
    ) => void,
  ): UnaryResponse;
  check(
    requestMessage: base_v1_service_pb.HealthRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.HealthResponse | null,
    ) => void,
  ): UnaryResponse;
}

export class PermissionClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  check(
    requestMessage: base_v1_service_pb.PermissionCheckRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionCheckResponse | null,
    ) => void,
  ): UnaryResponse;
  check(
    requestMessage: base_v1_service_pb.PermissionCheckRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionCheckResponse | null,
    ) => void,
  ): UnaryResponse;
  expand(
    requestMessage: base_v1_service_pb.PermissionExpandRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionExpandResponse | null,
    ) => void,
  ): UnaryResponse;
  expand(
    requestMessage: base_v1_service_pb.PermissionExpandRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionExpandResponse | null,
    ) => void,
  ): UnaryResponse;
  lookupEntity(
    requestMessage: base_v1_service_pb.PermissionLookupEntityRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionLookupEntityResponse | null,
    ) => void,
  ): UnaryResponse;
  lookupEntity(
    requestMessage: base_v1_service_pb.PermissionLookupEntityRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionLookupEntityResponse | null,
    ) => void,
  ): UnaryResponse;
  lookupEntityStream(
    requestMessage: base_v1_service_pb.PermissionLookupEntityRequest,
    metadata?: grpc.Metadata,
  ): ResponseStream<base_v1_service_pb.PermissionLookupEntityStreamResponse>;
  lookupSubject(
    requestMessage: base_v1_service_pb.PermissionLookupSubjectRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionLookupSubjectResponse | null,
    ) => void,
  ): UnaryResponse;
  lookupSubject(
    requestMessage: base_v1_service_pb.PermissionLookupSubjectRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionLookupSubjectResponse | null,
    ) => void,
  ): UnaryResponse;
  subjectPermission(
    requestMessage: base_v1_service_pb.PermissionSubjectPermissionRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionSubjectPermissionResponse | null,
    ) => void,
  ): UnaryResponse;
  subjectPermission(
    requestMessage: base_v1_service_pb.PermissionSubjectPermissionRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.PermissionSubjectPermissionResponse | null,
    ) => void,
  ): UnaryResponse;
}

export class WatchClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  watch(
    requestMessage: base_v1_service_pb.WatchRequest,
    metadata?: grpc.Metadata,
  ): ResponseStream<base_v1_service_pb.WatchResponse>;
}

export class SchemaClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  write(
    requestMessage: base_v1_service_pb.SchemaWriteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  write(
    requestMessage: base_v1_service_pb.SchemaWriteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  partialWrite(
    requestMessage: base_v1_service_pb.SchemaPartialWriteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaPartialWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  partialWrite(
    requestMessage: base_v1_service_pb.SchemaPartialWriteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaPartialWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  read(
    requestMessage: base_v1_service_pb.SchemaReadRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaReadResponse | null,
    ) => void,
  ): UnaryResponse;
  read(
    requestMessage: base_v1_service_pb.SchemaReadRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaReadResponse | null,
    ) => void,
  ): UnaryResponse;
  list(
    requestMessage: base_v1_service_pb.SchemaListRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaListResponse | null,
    ) => void,
  ): UnaryResponse;
  list(
    requestMessage: base_v1_service_pb.SchemaListRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.SchemaListResponse | null,
    ) => void,
  ): UnaryResponse;
}

export class DataClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  write(
    requestMessage: base_v1_service_pb.DataWriteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.DataWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  write(
    requestMessage: base_v1_service_pb.DataWriteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.DataWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  writeRelationships(
    requestMessage: base_v1_service_pb.RelationshipWriteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.RelationshipWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  writeRelationships(
    requestMessage: base_v1_service_pb.RelationshipWriteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.RelationshipWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  readRelationships(
    requestMessage: base_v1_service_pb.RelationshipReadRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.RelationshipReadResponse | null,
    ) => void,
  ): UnaryResponse;
  readRelationships(
    requestMessage: base_v1_service_pb.RelationshipReadRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.RelationshipReadResponse | null,
    ) => void,
  ): UnaryResponse;
  readAttributes(
    requestMessage: base_v1_service_pb.AttributeReadRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.AttributeReadResponse | null,
    ) => void,
  ): UnaryResponse;
  readAttributes(
    requestMessage: base_v1_service_pb.AttributeReadRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.AttributeReadResponse | null,
    ) => void,
  ): UnaryResponse;
  delete(
    requestMessage: base_v1_service_pb.DataDeleteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.DataDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
  delete(
    requestMessage: base_v1_service_pb.DataDeleteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.DataDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
  deleteRelationships(
    requestMessage: base_v1_service_pb.RelationshipDeleteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.RelationshipDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
  deleteRelationships(
    requestMessage: base_v1_service_pb.RelationshipDeleteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.RelationshipDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
}

export class BundleClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  write(
    requestMessage: base_v1_service_pb.BundleWriteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.BundleWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  write(
    requestMessage: base_v1_service_pb.BundleWriteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.BundleWriteResponse | null,
    ) => void,
  ): UnaryResponse;
  read(
    requestMessage: base_v1_service_pb.BundleReadRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.BundleReadResponse | null,
    ) => void,
  ): UnaryResponse;
  read(
    requestMessage: base_v1_service_pb.BundleReadRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.BundleReadResponse | null,
    ) => void,
  ): UnaryResponse;
  delete(
    requestMessage: base_v1_service_pb.BundleDeleteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.BundleDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
  delete(
    requestMessage: base_v1_service_pb.BundleDeleteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.BundleDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
}

export class TenancyClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: base_v1_service_pb.TenantCreateRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.TenantCreateResponse | null,
    ) => void,
  ): UnaryResponse;
  create(
    requestMessage: base_v1_service_pb.TenantCreateRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.TenantCreateResponse | null,
    ) => void,
  ): UnaryResponse;
  delete(
    requestMessage: base_v1_service_pb.TenantDeleteRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.TenantDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
  delete(
    requestMessage: base_v1_service_pb.TenantDeleteRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.TenantDeleteResponse | null,
    ) => void,
  ): UnaryResponse;
  list(
    requestMessage: base_v1_service_pb.TenantListRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.TenantListResponse | null,
    ) => void,
  ): UnaryResponse;
  list(
    requestMessage: base_v1_service_pb.TenantListRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: base_v1_service_pb.TenantListResponse | null,
    ) => void,
  ): UnaryResponse;
}
