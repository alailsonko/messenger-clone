// package: base.v1
// file: base/v1/service.proto

import * as jspb from 'google-protobuf';
import * as base_v1_base_pb from '../../base/v1/base_pb';
import * as validate_validate_pb from '../../validate/validate_pb';

export class HealthRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: HealthRequest,
  ): HealthRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: HealthRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): HealthRequest;
  static deserializeBinaryFromReader(
    message: HealthRequest,
    reader: jspb.BinaryReader,
  ): HealthRequest;
}

export namespace HealthRequest {
  export type AsObject = {};
}

export class HealthResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: HealthResponse,
  ): HealthResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: HealthResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): HealthResponse;
  static deserializeBinaryFromReader(
    message: HealthResponse,
    reader: jspb.BinaryReader,
  ): HealthResponse;
}

export namespace HealthResponse {
  export type AsObject = {
    status: string;
  };
}

export class PermissionCheckRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): PermissionCheckRequestMetadata | undefined;
  setMetadata(value?: PermissionCheckRequestMetadata): void;

  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): base_v1_base_pb.Entity | undefined;
  setEntity(value?: base_v1_base_pb.Entity): void;

  getPermission(): string;
  setPermission(value: string): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): base_v1_base_pb.Subject | undefined;
  setSubject(value?: base_v1_base_pb.Subject): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): base_v1_base_pb.Context | undefined;
  setContext(value?: base_v1_base_pb.Context): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<base_v1_base_pb.Argument>;
  setArgumentsList(value: Array<base_v1_base_pb.Argument>): void;
  addArguments(
    value?: base_v1_base_pb.Argument,
    index?: number,
  ): base_v1_base_pb.Argument;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionCheckRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionCheckRequest,
  ): PermissionCheckRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionCheckRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionCheckRequest;
  static deserializeBinaryFromReader(
    message: PermissionCheckRequest,
    reader: jspb.BinaryReader,
  ): PermissionCheckRequest;
}

export namespace PermissionCheckRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: PermissionCheckRequestMetadata.AsObject;
    entity?: base_v1_base_pb.Entity.AsObject;
    permission: string;
    subject?: base_v1_base_pb.Subject.AsObject;
    context?: base_v1_base_pb.Context.AsObject;
    argumentsList: Array<base_v1_base_pb.Argument.AsObject>;
  };
}

export class PermissionCheckRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  getSnapToken(): string;
  setSnapToken(value: string): void;

  getDepth(): number;
  setDepth(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionCheckRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionCheckRequestMetadata,
  ): PermissionCheckRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionCheckRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionCheckRequestMetadata;
  static deserializeBinaryFromReader(
    message: PermissionCheckRequestMetadata,
    reader: jspb.BinaryReader,
  ): PermissionCheckRequestMetadata;
}

export namespace PermissionCheckRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
    snapToken: string;
    depth: number;
  };
}

export class PermissionCheckResponse extends jspb.Message {
  getCan(): base_v1_base_pb.CheckResultMap[keyof base_v1_base_pb.CheckResultMap];
  setCan(
    value: base_v1_base_pb.CheckResultMap[keyof base_v1_base_pb.CheckResultMap],
  ): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): PermissionCheckResponseMetadata | undefined;
  setMetadata(value?: PermissionCheckResponseMetadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionCheckResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionCheckResponse,
  ): PermissionCheckResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionCheckResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionCheckResponse;
  static deserializeBinaryFromReader(
    message: PermissionCheckResponse,
    reader: jspb.BinaryReader,
  ): PermissionCheckResponse;
}

export namespace PermissionCheckResponse {
  export type AsObject = {
    can: base_v1_base_pb.CheckResultMap[keyof base_v1_base_pb.CheckResultMap];
    metadata?: PermissionCheckResponseMetadata.AsObject;
  };
}

export class PermissionCheckResponseMetadata extends jspb.Message {
  getCheckCount(): number;
  setCheckCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionCheckResponseMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionCheckResponseMetadata,
  ): PermissionCheckResponseMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionCheckResponseMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionCheckResponseMetadata;
  static deserializeBinaryFromReader(
    message: PermissionCheckResponseMetadata,
    reader: jspb.BinaryReader,
  ): PermissionCheckResponseMetadata;
}

export namespace PermissionCheckResponseMetadata {
  export type AsObject = {
    checkCount: number;
  };
}

export class PermissionExpandRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): PermissionExpandRequestMetadata | undefined;
  setMetadata(value?: PermissionExpandRequestMetadata): void;

  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): base_v1_base_pb.Entity | undefined;
  setEntity(value?: base_v1_base_pb.Entity): void;

  getPermission(): string;
  setPermission(value: string): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): base_v1_base_pb.Context | undefined;
  setContext(value?: base_v1_base_pb.Context): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<base_v1_base_pb.Argument>;
  setArgumentsList(value: Array<base_v1_base_pb.Argument>): void;
  addArguments(
    value?: base_v1_base_pb.Argument,
    index?: number,
  ): base_v1_base_pb.Argument;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionExpandRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionExpandRequest,
  ): PermissionExpandRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionExpandRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionExpandRequest;
  static deserializeBinaryFromReader(
    message: PermissionExpandRequest,
    reader: jspb.BinaryReader,
  ): PermissionExpandRequest;
}

export namespace PermissionExpandRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: PermissionExpandRequestMetadata.AsObject;
    entity?: base_v1_base_pb.Entity.AsObject;
    permission: string;
    context?: base_v1_base_pb.Context.AsObject;
    argumentsList: Array<base_v1_base_pb.Argument.AsObject>;
  };
}

export class PermissionExpandRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionExpandRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionExpandRequestMetadata,
  ): PermissionExpandRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionExpandRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionExpandRequestMetadata;
  static deserializeBinaryFromReader(
    message: PermissionExpandRequestMetadata,
    reader: jspb.BinaryReader,
  ): PermissionExpandRequestMetadata;
}

export namespace PermissionExpandRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
    snapToken: string;
  };
}

export class PermissionExpandResponse extends jspb.Message {
  hasTree(): boolean;
  clearTree(): void;
  getTree(): base_v1_base_pb.Expand | undefined;
  setTree(value?: base_v1_base_pb.Expand): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionExpandResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionExpandResponse,
  ): PermissionExpandResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionExpandResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionExpandResponse;
  static deserializeBinaryFromReader(
    message: PermissionExpandResponse,
    reader: jspb.BinaryReader,
  ): PermissionExpandResponse;
}

export namespace PermissionExpandResponse {
  export type AsObject = {
    tree?: base_v1_base_pb.Expand.AsObject;
  };
}

export class PermissionLookupEntityRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): PermissionLookupEntityRequestMetadata | undefined;
  setMetadata(value?: PermissionLookupEntityRequestMetadata): void;

  getEntityType(): string;
  setEntityType(value: string): void;

  getPermission(): string;
  setPermission(value: string): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): base_v1_base_pb.Subject | undefined;
  setSubject(value?: base_v1_base_pb.Subject): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): base_v1_base_pb.Context | undefined;
  setContext(value?: base_v1_base_pb.Context): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionLookupEntityRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionLookupEntityRequest,
  ): PermissionLookupEntityRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionLookupEntityRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionLookupEntityRequest;
  static deserializeBinaryFromReader(
    message: PermissionLookupEntityRequest,
    reader: jspb.BinaryReader,
  ): PermissionLookupEntityRequest;
}

export namespace PermissionLookupEntityRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: PermissionLookupEntityRequestMetadata.AsObject;
    entityType: string;
    permission: string;
    subject?: base_v1_base_pb.Subject.AsObject;
    context?: base_v1_base_pb.Context.AsObject;
    pageSize: number;
    continuousToken: string;
  };
}

export class PermissionLookupEntityRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  getSnapToken(): string;
  setSnapToken(value: string): void;

  getDepth(): number;
  setDepth(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): PermissionLookupEntityRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionLookupEntityRequestMetadata,
  ): PermissionLookupEntityRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionLookupEntityRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): PermissionLookupEntityRequestMetadata;
  static deserializeBinaryFromReader(
    message: PermissionLookupEntityRequestMetadata,
    reader: jspb.BinaryReader,
  ): PermissionLookupEntityRequestMetadata;
}

export namespace PermissionLookupEntityRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
    snapToken: string;
    depth: number;
  };
}

export class PermissionLookupEntityResponse extends jspb.Message {
  clearEntityIdsList(): void;
  getEntityIdsList(): Array<string>;
  setEntityIdsList(value: Array<string>): void;
  addEntityIds(value: string, index?: number): string;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionLookupEntityResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionLookupEntityResponse,
  ): PermissionLookupEntityResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionLookupEntityResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionLookupEntityResponse;
  static deserializeBinaryFromReader(
    message: PermissionLookupEntityResponse,
    reader: jspb.BinaryReader,
  ): PermissionLookupEntityResponse;
}

export namespace PermissionLookupEntityResponse {
  export type AsObject = {
    entityIdsList: Array<string>;
    continuousToken: string;
  };
}

export class PermissionLookupEntityStreamResponse extends jspb.Message {
  getEntityId(): string;
  setEntityId(value: string): void;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): PermissionLookupEntityStreamResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionLookupEntityStreamResponse,
  ): PermissionLookupEntityStreamResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionLookupEntityStreamResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): PermissionLookupEntityStreamResponse;
  static deserializeBinaryFromReader(
    message: PermissionLookupEntityStreamResponse,
    reader: jspb.BinaryReader,
  ): PermissionLookupEntityStreamResponse;
}

export namespace PermissionLookupEntityStreamResponse {
  export type AsObject = {
    entityId: string;
    continuousToken: string;
  };
}

export class PermissionEntityFilterRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): PermissionEntityFilterRequestMetadata | undefined;
  setMetadata(value?: PermissionEntityFilterRequestMetadata): void;

  hasEntityReference(): boolean;
  clearEntityReference(): void;
  getEntityReference(): base_v1_base_pb.RelationReference | undefined;
  setEntityReference(value?: base_v1_base_pb.RelationReference): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): base_v1_base_pb.Subject | undefined;
  setSubject(value?: base_v1_base_pb.Subject): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): base_v1_base_pb.Context | undefined;
  setContext(value?: base_v1_base_pb.Context): void;

  getCursor(): string;
  setCursor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionEntityFilterRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionEntityFilterRequest,
  ): PermissionEntityFilterRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionEntityFilterRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionEntityFilterRequest;
  static deserializeBinaryFromReader(
    message: PermissionEntityFilterRequest,
    reader: jspb.BinaryReader,
  ): PermissionEntityFilterRequest;
}

export namespace PermissionEntityFilterRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: PermissionEntityFilterRequestMetadata.AsObject;
    entityReference?: base_v1_base_pb.RelationReference.AsObject;
    subject?: base_v1_base_pb.Subject.AsObject;
    context?: base_v1_base_pb.Context.AsObject;
    cursor: string;
  };
}

export class PermissionEntityFilterRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  getSnapToken(): string;
  setSnapToken(value: string): void;

  getDepth(): number;
  setDepth(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): PermissionEntityFilterRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionEntityFilterRequestMetadata,
  ): PermissionEntityFilterRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionEntityFilterRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): PermissionEntityFilterRequestMetadata;
  static deserializeBinaryFromReader(
    message: PermissionEntityFilterRequestMetadata,
    reader: jspb.BinaryReader,
  ): PermissionEntityFilterRequestMetadata;
}

export namespace PermissionEntityFilterRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
    snapToken: string;
    depth: number;
  };
}

export class PermissionLookupSubjectRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): PermissionLookupSubjectRequestMetadata | undefined;
  setMetadata(value?: PermissionLookupSubjectRequestMetadata): void;

  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): base_v1_base_pb.Entity | undefined;
  setEntity(value?: base_v1_base_pb.Entity): void;

  getPermission(): string;
  setPermission(value: string): void;

  hasSubjectReference(): boolean;
  clearSubjectReference(): void;
  getSubjectReference(): base_v1_base_pb.RelationReference | undefined;
  setSubjectReference(value?: base_v1_base_pb.RelationReference): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): base_v1_base_pb.Context | undefined;
  setContext(value?: base_v1_base_pb.Context): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionLookupSubjectRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionLookupSubjectRequest,
  ): PermissionLookupSubjectRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionLookupSubjectRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionLookupSubjectRequest;
  static deserializeBinaryFromReader(
    message: PermissionLookupSubjectRequest,
    reader: jspb.BinaryReader,
  ): PermissionLookupSubjectRequest;
}

export namespace PermissionLookupSubjectRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: PermissionLookupSubjectRequestMetadata.AsObject;
    entity?: base_v1_base_pb.Entity.AsObject;
    permission: string;
    subjectReference?: base_v1_base_pb.RelationReference.AsObject;
    context?: base_v1_base_pb.Context.AsObject;
    pageSize: number;
    continuousToken: string;
  };
}

export class PermissionLookupSubjectRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  getSnapToken(): string;
  setSnapToken(value: string): void;

  getDepth(): number;
  setDepth(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): PermissionLookupSubjectRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionLookupSubjectRequestMetadata,
  ): PermissionLookupSubjectRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionLookupSubjectRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): PermissionLookupSubjectRequestMetadata;
  static deserializeBinaryFromReader(
    message: PermissionLookupSubjectRequestMetadata,
    reader: jspb.BinaryReader,
  ): PermissionLookupSubjectRequestMetadata;
}

export namespace PermissionLookupSubjectRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
    snapToken: string;
    depth: number;
  };
}

export class PermissionLookupSubjectResponse extends jspb.Message {
  clearSubjectIdsList(): void;
  getSubjectIdsList(): Array<string>;
  setSubjectIdsList(value: Array<string>): void;
  addSubjectIds(value: string, index?: number): string;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionLookupSubjectResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionLookupSubjectResponse,
  ): PermissionLookupSubjectResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionLookupSubjectResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionLookupSubjectResponse;
  static deserializeBinaryFromReader(
    message: PermissionLookupSubjectResponse,
    reader: jspb.BinaryReader,
  ): PermissionLookupSubjectResponse;
}

export namespace PermissionLookupSubjectResponse {
  export type AsObject = {
    subjectIdsList: Array<string>;
    continuousToken: string;
  };
}

export class PermissionSubjectPermissionRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): PermissionSubjectPermissionRequestMetadata | undefined;
  setMetadata(value?: PermissionSubjectPermissionRequestMetadata): void;

  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): base_v1_base_pb.Entity | undefined;
  setEntity(value?: base_v1_base_pb.Entity): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): base_v1_base_pb.Subject | undefined;
  setSubject(value?: base_v1_base_pb.Subject): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): base_v1_base_pb.Context | undefined;
  setContext(value?: base_v1_base_pb.Context): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): PermissionSubjectPermissionRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionSubjectPermissionRequest,
  ): PermissionSubjectPermissionRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionSubjectPermissionRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): PermissionSubjectPermissionRequest;
  static deserializeBinaryFromReader(
    message: PermissionSubjectPermissionRequest,
    reader: jspb.BinaryReader,
  ): PermissionSubjectPermissionRequest;
}

export namespace PermissionSubjectPermissionRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: PermissionSubjectPermissionRequestMetadata.AsObject;
    entity?: base_v1_base_pb.Entity.AsObject;
    subject?: base_v1_base_pb.Subject.AsObject;
    context?: base_v1_base_pb.Context.AsObject;
  };
}

export class PermissionSubjectPermissionRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  getSnapToken(): string;
  setSnapToken(value: string): void;

  getOnlyPermission(): boolean;
  setOnlyPermission(value: boolean): void;

  getDepth(): number;
  setDepth(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): PermissionSubjectPermissionRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionSubjectPermissionRequestMetadata,
  ): PermissionSubjectPermissionRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionSubjectPermissionRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): PermissionSubjectPermissionRequestMetadata;
  static deserializeBinaryFromReader(
    message: PermissionSubjectPermissionRequestMetadata,
    reader: jspb.BinaryReader,
  ): PermissionSubjectPermissionRequestMetadata;
}

export namespace PermissionSubjectPermissionRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
    snapToken: string;
    onlyPermission: boolean;
    depth: number;
  };
}

export class PermissionSubjectPermissionResponse extends jspb.Message {
  getResultsMap(): jspb.Map<
    string,
    base_v1_base_pb.CheckResult[keyof base_v1_base_pb.CheckResult]
  >;
  clearResultsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): PermissionSubjectPermissionResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionSubjectPermissionResponse,
  ): PermissionSubjectPermissionResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionSubjectPermissionResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): PermissionSubjectPermissionResponse;
  static deserializeBinaryFromReader(
    message: PermissionSubjectPermissionResponse,
    reader: jspb.BinaryReader,
  ): PermissionSubjectPermissionResponse;
}

export namespace PermissionSubjectPermissionResponse {
  export type AsObject = {
    resultsMap: Array<
      [string, base_v1_base_pb.CheckResult[keyof base_v1_base_pb.CheckResult]]
    >;
  };
}

export class WatchRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WatchRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: WatchRequest,
  ): WatchRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: WatchRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): WatchRequest;
  static deserializeBinaryFromReader(
    message: WatchRequest,
    reader: jspb.BinaryReader,
  ): WatchRequest;
}

export namespace WatchRequest {
  export type AsObject = {
    tenantId: string;
    snapToken: string;
  };
}

export class WatchResponse extends jspb.Message {
  hasChanges(): boolean;
  clearChanges(): void;
  getChanges(): base_v1_base_pb.DataChanges | undefined;
  setChanges(value?: base_v1_base_pb.DataChanges): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WatchResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: WatchResponse,
  ): WatchResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: WatchResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): WatchResponse;
  static deserializeBinaryFromReader(
    message: WatchResponse,
    reader: jspb.BinaryReader,
  ): WatchResponse;
}

export namespace WatchResponse {
  export type AsObject = {
    changes?: base_v1_base_pb.DataChanges.AsObject;
  };
}

export class SchemaWriteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  getSchema(): string;
  setSchema(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaWriteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaWriteRequest,
  ): SchemaWriteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaWriteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaWriteRequest;
  static deserializeBinaryFromReader(
    message: SchemaWriteRequest,
    reader: jspb.BinaryReader,
  ): SchemaWriteRequest;
}

export namespace SchemaWriteRequest {
  export type AsObject = {
    tenantId: string;
    schema: string;
  };
}

export class SchemaWriteResponse extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaWriteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaWriteResponse,
  ): SchemaWriteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaWriteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaWriteResponse;
  static deserializeBinaryFromReader(
    message: SchemaWriteResponse,
    reader: jspb.BinaryReader,
  ): SchemaWriteResponse;
}

export namespace SchemaWriteResponse {
  export type AsObject = {
    schemaVersion: string;
  };
}

export class SchemaPartialWriteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): SchemaPartialWriteRequestMetadata | undefined;
  setMetadata(value?: SchemaPartialWriteRequestMetadata): void;

  getPartialsMap(): jspb.Map<string, base_v1_base_pb.Partials>;
  clearPartialsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaPartialWriteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaPartialWriteRequest,
  ): SchemaPartialWriteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaPartialWriteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaPartialWriteRequest;
  static deserializeBinaryFromReader(
    message: SchemaPartialWriteRequest,
    reader: jspb.BinaryReader,
  ): SchemaPartialWriteRequest;
}

export namespace SchemaPartialWriteRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: SchemaPartialWriteRequestMetadata.AsObject;
    partialsMap: Array<[string, base_v1_base_pb.Partials.AsObject]>;
  };
}

export class SchemaPartialWriteRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): SchemaPartialWriteRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaPartialWriteRequestMetadata,
  ): SchemaPartialWriteRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaPartialWriteRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(
    bytes: Uint8Array,
  ): SchemaPartialWriteRequestMetadata;
  static deserializeBinaryFromReader(
    message: SchemaPartialWriteRequestMetadata,
    reader: jspb.BinaryReader,
  ): SchemaPartialWriteRequestMetadata;
}

export namespace SchemaPartialWriteRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
  };
}

export class SchemaPartialWriteResponse extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaPartialWriteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaPartialWriteResponse,
  ): SchemaPartialWriteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaPartialWriteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaPartialWriteResponse;
  static deserializeBinaryFromReader(
    message: SchemaPartialWriteResponse,
    reader: jspb.BinaryReader,
  ): SchemaPartialWriteResponse;
}

export namespace SchemaPartialWriteResponse {
  export type AsObject = {
    schemaVersion: string;
  };
}

export class SchemaReadRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): SchemaReadRequestMetadata | undefined;
  setMetadata(value?: SchemaReadRequestMetadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaReadRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaReadRequest,
  ): SchemaReadRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaReadRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaReadRequest;
  static deserializeBinaryFromReader(
    message: SchemaReadRequest,
    reader: jspb.BinaryReader,
  ): SchemaReadRequest;
}

export namespace SchemaReadRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: SchemaReadRequestMetadata.AsObject;
  };
}

export class SchemaReadRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaReadRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaReadRequestMetadata,
  ): SchemaReadRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaReadRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaReadRequestMetadata;
  static deserializeBinaryFromReader(
    message: SchemaReadRequestMetadata,
    reader: jspb.BinaryReader,
  ): SchemaReadRequestMetadata;
}

export namespace SchemaReadRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
  };
}

export class SchemaReadResponse extends jspb.Message {
  hasSchema(): boolean;
  clearSchema(): void;
  getSchema(): base_v1_base_pb.SchemaDefinition | undefined;
  setSchema(value?: base_v1_base_pb.SchemaDefinition): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaReadResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaReadResponse,
  ): SchemaReadResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaReadResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaReadResponse;
  static deserializeBinaryFromReader(
    message: SchemaReadResponse,
    reader: jspb.BinaryReader,
  ): SchemaReadResponse;
}

export namespace SchemaReadResponse {
  export type AsObject = {
    schema?: base_v1_base_pb.SchemaDefinition.AsObject;
  };
}

export class SchemaListRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaListRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaListRequest,
  ): SchemaListRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaListRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaListRequest;
  static deserializeBinaryFromReader(
    message: SchemaListRequest,
    reader: jspb.BinaryReader,
  ): SchemaListRequest;
}

export namespace SchemaListRequest {
  export type AsObject = {
    tenantId: string;
    pageSize: number;
    continuousToken: string;
  };
}

export class SchemaListResponse extends jspb.Message {
  getHead(): string;
  setHead(value: string): void;

  clearSchemasList(): void;
  getSchemasList(): Array<SchemaList>;
  setSchemasList(value: Array<SchemaList>): void;
  addSchemas(value?: SchemaList, index?: number): SchemaList;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaListResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaListResponse,
  ): SchemaListResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaListResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaListResponse;
  static deserializeBinaryFromReader(
    message: SchemaListResponse,
    reader: jspb.BinaryReader,
  ): SchemaListResponse;
}

export namespace SchemaListResponse {
  export type AsObject = {
    head: string;
    schemasList: Array<SchemaList.AsObject>;
    continuousToken: string;
  };
}

export class SchemaList extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  getCreatedAt(): string;
  setCreatedAt(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaList.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaList,
  ): SchemaList.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaList,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaList;
  static deserializeBinaryFromReader(
    message: SchemaList,
    reader: jspb.BinaryReader,
  ): SchemaList;
}

export namespace SchemaList {
  export type AsObject = {
    version: string;
    createdAt: string;
  };
}

export class DataWriteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): DataWriteRequestMetadata | undefined;
  setMetadata(value?: DataWriteRequestMetadata): void;

  clearTuplesList(): void;
  getTuplesList(): Array<base_v1_base_pb.Tuple>;
  setTuplesList(value: Array<base_v1_base_pb.Tuple>): void;
  addTuples(
    value?: base_v1_base_pb.Tuple,
    index?: number,
  ): base_v1_base_pb.Tuple;

  clearAttributesList(): void;
  getAttributesList(): Array<base_v1_base_pb.Attribute>;
  setAttributesList(value: Array<base_v1_base_pb.Attribute>): void;
  addAttributes(
    value?: base_v1_base_pb.Attribute,
    index?: number,
  ): base_v1_base_pb.Attribute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataWriteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataWriteRequest,
  ): DataWriteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataWriteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataWriteRequest;
  static deserializeBinaryFromReader(
    message: DataWriteRequest,
    reader: jspb.BinaryReader,
  ): DataWriteRequest;
}

export namespace DataWriteRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: DataWriteRequestMetadata.AsObject;
    tuplesList: Array<base_v1_base_pb.Tuple.AsObject>;
    attributesList: Array<base_v1_base_pb.Attribute.AsObject>;
  };
}

export class DataWriteRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataWriteRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataWriteRequestMetadata,
  ): DataWriteRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataWriteRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataWriteRequestMetadata;
  static deserializeBinaryFromReader(
    message: DataWriteRequestMetadata,
    reader: jspb.BinaryReader,
  ): DataWriteRequestMetadata;
}

export namespace DataWriteRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
  };
}

export class DataWriteResponse extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataWriteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataWriteResponse,
  ): DataWriteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataWriteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataWriteResponse;
  static deserializeBinaryFromReader(
    message: DataWriteResponse,
    reader: jspb.BinaryReader,
  ): DataWriteResponse;
}

export namespace DataWriteResponse {
  export type AsObject = {
    snapToken: string;
  };
}

export class RelationshipWriteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): RelationshipWriteRequestMetadata | undefined;
  setMetadata(value?: RelationshipWriteRequestMetadata): void;

  clearTuplesList(): void;
  getTuplesList(): Array<base_v1_base_pb.Tuple>;
  setTuplesList(value: Array<base_v1_base_pb.Tuple>): void;
  addTuples(
    value?: base_v1_base_pb.Tuple,
    index?: number,
  ): base_v1_base_pb.Tuple;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationshipWriteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipWriteRequest,
  ): RelationshipWriteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipWriteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipWriteRequest;
  static deserializeBinaryFromReader(
    message: RelationshipWriteRequest,
    reader: jspb.BinaryReader,
  ): RelationshipWriteRequest;
}

export namespace RelationshipWriteRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: RelationshipWriteRequestMetadata.AsObject;
    tuplesList: Array<base_v1_base_pb.Tuple.AsObject>;
  };
}

export class RelationshipWriteRequestMetadata extends jspb.Message {
  getSchemaVersion(): string;
  setSchemaVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(
    includeInstance?: boolean,
  ): RelationshipWriteRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipWriteRequestMetadata,
  ): RelationshipWriteRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipWriteRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipWriteRequestMetadata;
  static deserializeBinaryFromReader(
    message: RelationshipWriteRequestMetadata,
    reader: jspb.BinaryReader,
  ): RelationshipWriteRequestMetadata;
}

export namespace RelationshipWriteRequestMetadata {
  export type AsObject = {
    schemaVersion: string;
  };
}

export class RelationshipWriteResponse extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationshipWriteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipWriteResponse,
  ): RelationshipWriteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipWriteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipWriteResponse;
  static deserializeBinaryFromReader(
    message: RelationshipWriteResponse,
    reader: jspb.BinaryReader,
  ): RelationshipWriteResponse;
}

export namespace RelationshipWriteResponse {
  export type AsObject = {
    snapToken: string;
  };
}

export class RelationshipReadRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): RelationshipReadRequestMetadata | undefined;
  setMetadata(value?: RelationshipReadRequestMetadata): void;

  hasFilter(): boolean;
  clearFilter(): void;
  getFilter(): base_v1_base_pb.TupleFilter | undefined;
  setFilter(value?: base_v1_base_pb.TupleFilter): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationshipReadRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipReadRequest,
  ): RelationshipReadRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipReadRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipReadRequest;
  static deserializeBinaryFromReader(
    message: RelationshipReadRequest,
    reader: jspb.BinaryReader,
  ): RelationshipReadRequest;
}

export namespace RelationshipReadRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: RelationshipReadRequestMetadata.AsObject;
    filter?: base_v1_base_pb.TupleFilter.AsObject;
    pageSize: number;
    continuousToken: string;
  };
}

export class RelationshipReadRequestMetadata extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationshipReadRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipReadRequestMetadata,
  ): RelationshipReadRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipReadRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipReadRequestMetadata;
  static deserializeBinaryFromReader(
    message: RelationshipReadRequestMetadata,
    reader: jspb.BinaryReader,
  ): RelationshipReadRequestMetadata;
}

export namespace RelationshipReadRequestMetadata {
  export type AsObject = {
    snapToken: string;
  };
}

export class RelationshipReadResponse extends jspb.Message {
  clearTuplesList(): void;
  getTuplesList(): Array<base_v1_base_pb.Tuple>;
  setTuplesList(value: Array<base_v1_base_pb.Tuple>): void;
  addTuples(
    value?: base_v1_base_pb.Tuple,
    index?: number,
  ): base_v1_base_pb.Tuple;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationshipReadResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipReadResponse,
  ): RelationshipReadResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipReadResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipReadResponse;
  static deserializeBinaryFromReader(
    message: RelationshipReadResponse,
    reader: jspb.BinaryReader,
  ): RelationshipReadResponse;
}

export namespace RelationshipReadResponse {
  export type AsObject = {
    tuplesList: Array<base_v1_base_pb.Tuple.AsObject>;
    continuousToken: string;
  };
}

export class AttributeReadRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): AttributeReadRequestMetadata | undefined;
  setMetadata(value?: AttributeReadRequestMetadata): void;

  hasFilter(): boolean;
  clearFilter(): void;
  getFilter(): base_v1_base_pb.AttributeFilter | undefined;
  setFilter(value?: base_v1_base_pb.AttributeFilter): void;

  getPageSize(): number;
  setPageSize(value: number): void;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttributeReadRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AttributeReadRequest,
  ): AttributeReadRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AttributeReadRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): AttributeReadRequest;
  static deserializeBinaryFromReader(
    message: AttributeReadRequest,
    reader: jspb.BinaryReader,
  ): AttributeReadRequest;
}

export namespace AttributeReadRequest {
  export type AsObject = {
    tenantId: string;
    metadata?: AttributeReadRequestMetadata.AsObject;
    filter?: base_v1_base_pb.AttributeFilter.AsObject;
    pageSize: number;
    continuousToken: string;
  };
}

export class AttributeReadRequestMetadata extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttributeReadRequestMetadata.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AttributeReadRequestMetadata,
  ): AttributeReadRequestMetadata.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AttributeReadRequestMetadata,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): AttributeReadRequestMetadata;
  static deserializeBinaryFromReader(
    message: AttributeReadRequestMetadata,
    reader: jspb.BinaryReader,
  ): AttributeReadRequestMetadata;
}

export namespace AttributeReadRequestMetadata {
  export type AsObject = {
    snapToken: string;
  };
}

export class AttributeReadResponse extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<base_v1_base_pb.Attribute>;
  setAttributesList(value: Array<base_v1_base_pb.Attribute>): void;
  addAttributes(
    value?: base_v1_base_pb.Attribute,
    index?: number,
  ): base_v1_base_pb.Attribute;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttributeReadResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AttributeReadResponse,
  ): AttributeReadResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AttributeReadResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): AttributeReadResponse;
  static deserializeBinaryFromReader(
    message: AttributeReadResponse,
    reader: jspb.BinaryReader,
  ): AttributeReadResponse;
}

export namespace AttributeReadResponse {
  export type AsObject = {
    attributesList: Array<base_v1_base_pb.Attribute.AsObject>;
    continuousToken: string;
  };
}

export class DataDeleteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasTupleFilter(): boolean;
  clearTupleFilter(): void;
  getTupleFilter(): base_v1_base_pb.TupleFilter | undefined;
  setTupleFilter(value?: base_v1_base_pb.TupleFilter): void;

  hasAttributeFilter(): boolean;
  clearAttributeFilter(): void;
  getAttributeFilter(): base_v1_base_pb.AttributeFilter | undefined;
  setAttributeFilter(value?: base_v1_base_pb.AttributeFilter): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataDeleteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataDeleteRequest,
  ): DataDeleteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataDeleteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataDeleteRequest;
  static deserializeBinaryFromReader(
    message: DataDeleteRequest,
    reader: jspb.BinaryReader,
  ): DataDeleteRequest;
}

export namespace DataDeleteRequest {
  export type AsObject = {
    tenantId: string;
    tupleFilter?: base_v1_base_pb.TupleFilter.AsObject;
    attributeFilter?: base_v1_base_pb.AttributeFilter.AsObject;
  };
}

export class DataDeleteResponse extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataDeleteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataDeleteResponse,
  ): DataDeleteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataDeleteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataDeleteResponse;
  static deserializeBinaryFromReader(
    message: DataDeleteResponse,
    reader: jspb.BinaryReader,
  ): DataDeleteResponse;
}

export namespace DataDeleteResponse {
  export type AsObject = {
    snapToken: string;
  };
}

export class RelationshipDeleteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  hasFilter(): boolean;
  clearFilter(): void;
  getFilter(): base_v1_base_pb.TupleFilter | undefined;
  setFilter(value?: base_v1_base_pb.TupleFilter): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationshipDeleteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipDeleteRequest,
  ): RelationshipDeleteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipDeleteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipDeleteRequest;
  static deserializeBinaryFromReader(
    message: RelationshipDeleteRequest,
    reader: jspb.BinaryReader,
  ): RelationshipDeleteRequest;
}

export namespace RelationshipDeleteRequest {
  export type AsObject = {
    tenantId: string;
    filter?: base_v1_base_pb.TupleFilter.AsObject;
  };
}

export class RelationshipDeleteResponse extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationshipDeleteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationshipDeleteResponse,
  ): RelationshipDeleteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationshipDeleteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationshipDeleteResponse;
  static deserializeBinaryFromReader(
    message: RelationshipDeleteResponse,
    reader: jspb.BinaryReader,
  ): RelationshipDeleteResponse;
}

export namespace RelationshipDeleteResponse {
  export type AsObject = {
    snapToken: string;
  };
}

export class BundleRunRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getArgumentsMap(): jspb.Map<string, string>;
  clearArgumentsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleRunRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleRunRequest,
  ): BundleRunRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleRunRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleRunRequest;
  static deserializeBinaryFromReader(
    message: BundleRunRequest,
    reader: jspb.BinaryReader,
  ): BundleRunRequest;
}

export namespace BundleRunRequest {
  export type AsObject = {
    tenantId: string;
    name: string;
    argumentsMap: Array<[string, string]>;
  };
}

export class BundleRunResponse extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleRunResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleRunResponse,
  ): BundleRunResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleRunResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleRunResponse;
  static deserializeBinaryFromReader(
    message: BundleRunResponse,
    reader: jspb.BinaryReader,
  ): BundleRunResponse;
}

export namespace BundleRunResponse {
  export type AsObject = {
    snapToken: string;
  };
}

export class BundleWriteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  clearBundlesList(): void;
  getBundlesList(): Array<base_v1_base_pb.DataBundle>;
  setBundlesList(value: Array<base_v1_base_pb.DataBundle>): void;
  addBundles(
    value?: base_v1_base_pb.DataBundle,
    index?: number,
  ): base_v1_base_pb.DataBundle;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleWriteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleWriteRequest,
  ): BundleWriteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleWriteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleWriteRequest;
  static deserializeBinaryFromReader(
    message: BundleWriteRequest,
    reader: jspb.BinaryReader,
  ): BundleWriteRequest;
}

export namespace BundleWriteRequest {
  export type AsObject = {
    tenantId: string;
    bundlesList: Array<base_v1_base_pb.DataBundle.AsObject>;
  };
}

export class BundleWriteResponse extends jspb.Message {
  clearNamesList(): void;
  getNamesList(): Array<string>;
  setNamesList(value: Array<string>): void;
  addNames(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleWriteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleWriteResponse,
  ): BundleWriteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleWriteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleWriteResponse;
  static deserializeBinaryFromReader(
    message: BundleWriteResponse,
    reader: jspb.BinaryReader,
  ): BundleWriteResponse;
}

export namespace BundleWriteResponse {
  export type AsObject = {
    namesList: Array<string>;
  };
}

export class BundleReadRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleReadRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleReadRequest,
  ): BundleReadRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleReadRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleReadRequest;
  static deserializeBinaryFromReader(
    message: BundleReadRequest,
    reader: jspb.BinaryReader,
  ): BundleReadRequest;
}

export namespace BundleReadRequest {
  export type AsObject = {
    tenantId: string;
    name: string;
  };
}

export class BundleReadResponse extends jspb.Message {
  hasBundle(): boolean;
  clearBundle(): void;
  getBundle(): base_v1_base_pb.DataBundle | undefined;
  setBundle(value?: base_v1_base_pb.DataBundle): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleReadResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleReadResponse,
  ): BundleReadResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleReadResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleReadResponse;
  static deserializeBinaryFromReader(
    message: BundleReadResponse,
    reader: jspb.BinaryReader,
  ): BundleReadResponse;
}

export namespace BundleReadResponse {
  export type AsObject = {
    bundle?: base_v1_base_pb.DataBundle.AsObject;
  };
}

export class BundleDeleteRequest extends jspb.Message {
  getTenantId(): string;
  setTenantId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleDeleteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleDeleteRequest,
  ): BundleDeleteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleDeleteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleDeleteRequest;
  static deserializeBinaryFromReader(
    message: BundleDeleteRequest,
    reader: jspb.BinaryReader,
  ): BundleDeleteRequest;
}

export namespace BundleDeleteRequest {
  export type AsObject = {
    tenantId: string;
    name: string;
  };
}

export class BundleDeleteResponse extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BundleDeleteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BundleDeleteResponse,
  ): BundleDeleteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BundleDeleteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BundleDeleteResponse;
  static deserializeBinaryFromReader(
    message: BundleDeleteResponse,
    reader: jspb.BinaryReader,
  ): BundleDeleteResponse;
}

export namespace BundleDeleteResponse {
  export type AsObject = {
    name: string;
  };
}

export class TenantCreateRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TenantCreateRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TenantCreateRequest,
  ): TenantCreateRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TenantCreateRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TenantCreateRequest;
  static deserializeBinaryFromReader(
    message: TenantCreateRequest,
    reader: jspb.BinaryReader,
  ): TenantCreateRequest;
}

export namespace TenantCreateRequest {
  export type AsObject = {
    id: string;
    name: string;
  };
}

export class TenantCreateResponse extends jspb.Message {
  hasTenant(): boolean;
  clearTenant(): void;
  getTenant(): base_v1_base_pb.Tenant | undefined;
  setTenant(value?: base_v1_base_pb.Tenant): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TenantCreateResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TenantCreateResponse,
  ): TenantCreateResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TenantCreateResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TenantCreateResponse;
  static deserializeBinaryFromReader(
    message: TenantCreateResponse,
    reader: jspb.BinaryReader,
  ): TenantCreateResponse;
}

export namespace TenantCreateResponse {
  export type AsObject = {
    tenant?: base_v1_base_pb.Tenant.AsObject;
  };
}

export class TenantDeleteRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TenantDeleteRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TenantDeleteRequest,
  ): TenantDeleteRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TenantDeleteRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TenantDeleteRequest;
  static deserializeBinaryFromReader(
    message: TenantDeleteRequest,
    reader: jspb.BinaryReader,
  ): TenantDeleteRequest;
}

export namespace TenantDeleteRequest {
  export type AsObject = {
    id: string;
  };
}

export class TenantDeleteResponse extends jspb.Message {
  hasTenant(): boolean;
  clearTenant(): void;
  getTenant(): base_v1_base_pb.Tenant | undefined;
  setTenant(value?: base_v1_base_pb.Tenant): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TenantDeleteResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TenantDeleteResponse,
  ): TenantDeleteResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TenantDeleteResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TenantDeleteResponse;
  static deserializeBinaryFromReader(
    message: TenantDeleteResponse,
    reader: jspb.BinaryReader,
  ): TenantDeleteResponse;
}

export namespace TenantDeleteResponse {
  export type AsObject = {
    tenant?: base_v1_base_pb.Tenant.AsObject;
  };
}

export class TenantListRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): void;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TenantListRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TenantListRequest,
  ): TenantListRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TenantListRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TenantListRequest;
  static deserializeBinaryFromReader(
    message: TenantListRequest,
    reader: jspb.BinaryReader,
  ): TenantListRequest;
}

export namespace TenantListRequest {
  export type AsObject = {
    pageSize: number;
    continuousToken: string;
  };
}

export class TenantListResponse extends jspb.Message {
  clearTenantsList(): void;
  getTenantsList(): Array<base_v1_base_pb.Tenant>;
  setTenantsList(value: Array<base_v1_base_pb.Tenant>): void;
  addTenants(
    value?: base_v1_base_pb.Tenant,
    index?: number,
  ): base_v1_base_pb.Tenant;

  getContinuousToken(): string;
  setContinuousToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TenantListResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TenantListResponse,
  ): TenantListResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TenantListResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TenantListResponse;
  static deserializeBinaryFromReader(
    message: TenantListResponse,
    reader: jspb.BinaryReader,
  ): TenantListResponse;
}

export namespace TenantListResponse {
  export type AsObject = {
    tenantsList: Array<base_v1_base_pb.Tenant.AsObject>;
    continuousToken: string;
  };
}
