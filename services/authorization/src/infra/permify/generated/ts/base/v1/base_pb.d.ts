// package: base.v1
// file: base/v1/base.proto

import * as jspb from 'google-protobuf';
import * as google_api_expr_v1alpha1_checked_pb from '../../google/api/expr/v1alpha1/checked_pb';
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as validate_validate_pb from '../../validate/validate_pb';

export class Context extends jspb.Message {
  clearTuplesList(): void;
  getTuplesList(): Array<Tuple>;
  setTuplesList(value: Array<Tuple>): void;
  addTuples(value?: Tuple, index?: number): Tuple;

  clearAttributesList(): void;
  getAttributesList(): Array<Attribute>;
  setAttributesList(value: Array<Attribute>): void;
  addAttributes(value?: Attribute, index?: number): Attribute;

  hasData(): boolean;
  clearData(): void;
  getData(): google_protobuf_struct_pb.Struct | undefined;
  setData(value?: google_protobuf_struct_pb.Struct): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Context.AsObject;
  static toObject(includeInstance: boolean, msg: Context): Context.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Context,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Context;
  static deserializeBinaryFromReader(
    message: Context,
    reader: jspb.BinaryReader,
  ): Context;
}

export namespace Context {
  export type AsObject = {
    tuplesList: Array<Tuple.AsObject>;
    attributesList: Array<Attribute.AsObject>;
    data?: google_protobuf_struct_pb.Struct.AsObject;
  };
}

export class Child extends jspb.Message {
  hasLeaf(): boolean;
  clearLeaf(): void;
  getLeaf(): Leaf | undefined;
  setLeaf(value?: Leaf): void;

  hasRewrite(): boolean;
  clearRewrite(): void;
  getRewrite(): Rewrite | undefined;
  setRewrite(value?: Rewrite): void;

  getTypeCase(): Child.TypeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Child.AsObject;
  static toObject(includeInstance: boolean, msg: Child): Child.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Child,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Child;
  static deserializeBinaryFromReader(
    message: Child,
    reader: jspb.BinaryReader,
  ): Child;
}

export namespace Child {
  export type AsObject = {
    leaf?: Leaf.AsObject;
    rewrite?: Rewrite.AsObject;
  };

  export enum TypeCase {
    TYPE_NOT_SET = 0,
    LEAF = 1,
    REWRITE = 2,
  }
}

export class Leaf extends jspb.Message {
  hasComputedUserSet(): boolean;
  clearComputedUserSet(): void;
  getComputedUserSet(): ComputedUserSet | undefined;
  setComputedUserSet(value?: ComputedUserSet): void;

  hasTupleToUserSet(): boolean;
  clearTupleToUserSet(): void;
  getTupleToUserSet(): TupleToUserSet | undefined;
  setTupleToUserSet(value?: TupleToUserSet): void;

  hasComputedAttribute(): boolean;
  clearComputedAttribute(): void;
  getComputedAttribute(): ComputedAttribute | undefined;
  setComputedAttribute(value?: ComputedAttribute): void;

  hasCall(): boolean;
  clearCall(): void;
  getCall(): Call | undefined;
  setCall(value?: Call): void;

  getTypeCase(): Leaf.TypeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Leaf.AsObject;
  static toObject(includeInstance: boolean, msg: Leaf): Leaf.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Leaf,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Leaf;
  static deserializeBinaryFromReader(
    message: Leaf,
    reader: jspb.BinaryReader,
  ): Leaf;
}

export namespace Leaf {
  export type AsObject = {
    computedUserSet?: ComputedUserSet.AsObject;
    tupleToUserSet?: TupleToUserSet.AsObject;
    computedAttribute?: ComputedAttribute.AsObject;
    call?: Call.AsObject;
  };

  export enum TypeCase {
    TYPE_NOT_SET = 0,
    COMPUTED_USER_SET = 1,
    TUPLE_TO_USER_SET = 2,
    COMPUTED_ATTRIBUTE = 3,
    CALL = 4,
  }
}

export class Rewrite extends jspb.Message {
  getRewriteOperation(): Rewrite.OperationMap[keyof Rewrite.OperationMap];
  setRewriteOperation(
    value: Rewrite.OperationMap[keyof Rewrite.OperationMap],
  ): void;

  clearChildrenList(): void;
  getChildrenList(): Array<Child>;
  setChildrenList(value: Array<Child>): void;
  addChildren(value?: Child, index?: number): Child;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Rewrite.AsObject;
  static toObject(includeInstance: boolean, msg: Rewrite): Rewrite.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Rewrite,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Rewrite;
  static deserializeBinaryFromReader(
    message: Rewrite,
    reader: jspb.BinaryReader,
  ): Rewrite;
}

export namespace Rewrite {
  export type AsObject = {
    rewriteOperation: Rewrite.OperationMap[keyof Rewrite.OperationMap];
    childrenList: Array<Child.AsObject>;
  };

  export interface OperationMap {
    OPERATION_UNSPECIFIED: 0;
    OPERATION_UNION: 1;
    OPERATION_INTERSECTION: 2;
    OPERATION_EXCLUSION: 3;
  }

  export const Operation: OperationMap;
}

export class SchemaDefinition extends jspb.Message {
  getEntityDefinitionsMap(): jspb.Map<string, EntityDefinition>;
  clearEntityDefinitionsMap(): void;
  getRuleDefinitionsMap(): jspb.Map<string, RuleDefinition>;
  clearRuleDefinitionsMap(): void;
  getReferencesMap(): jspb.Map<
    string,
    SchemaDefinition.ReferenceMap[keyof SchemaDefinition.ReferenceMap]
  >;
  clearReferencesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SchemaDefinition.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SchemaDefinition,
  ): SchemaDefinition.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SchemaDefinition,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SchemaDefinition;
  static deserializeBinaryFromReader(
    message: SchemaDefinition,
    reader: jspb.BinaryReader,
  ): SchemaDefinition;
}

export namespace SchemaDefinition {
  export type AsObject = {
    entityDefinitionsMap: Array<[string, EntityDefinition.AsObject]>;
    ruleDefinitionsMap: Array<[string, RuleDefinition.AsObject]>;
    referencesMap: Array<
      [
        string,
        SchemaDefinition.ReferenceMap[keyof SchemaDefinition.ReferenceMap],
      ]
    >;
  };

  export interface ReferenceMap {
    REFERENCE_UNSPECIFIED: 0;
    REFERENCE_ENTITY: 1;
    REFERENCE_RULE: 2;
  }

  export const Reference: ReferenceMap;
}

export class EntityDefinition extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getRelationsMap(): jspb.Map<string, RelationDefinition>;
  clearRelationsMap(): void;
  getPermissionsMap(): jspb.Map<string, PermissionDefinition>;
  clearPermissionsMap(): void;
  getAttributesMap(): jspb.Map<string, AttributeDefinition>;
  clearAttributesMap(): void;
  getReferencesMap(): jspb.Map<
    string,
    EntityDefinition.ReferenceMap[keyof EntityDefinition.ReferenceMap]
  >;
  clearReferencesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntityDefinition.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EntityDefinition,
  ): EntityDefinition.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: EntityDefinition,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): EntityDefinition;
  static deserializeBinaryFromReader(
    message: EntityDefinition,
    reader: jspb.BinaryReader,
  ): EntityDefinition;
}

export namespace EntityDefinition {
  export type AsObject = {
    name: string;
    relationsMap: Array<[string, RelationDefinition.AsObject]>;
    permissionsMap: Array<[string, PermissionDefinition.AsObject]>;
    attributesMap: Array<[string, AttributeDefinition.AsObject]>;
    referencesMap: Array<
      [
        string,
        EntityDefinition.ReferenceMap[keyof EntityDefinition.ReferenceMap],
      ]
    >;
  };

  export interface ReferenceMap {
    REFERENCE_UNSPECIFIED: 0;
    REFERENCE_RELATION: 1;
    REFERENCE_PERMISSION: 2;
    REFERENCE_ATTRIBUTE: 3;
  }

  export const Reference: ReferenceMap;
}

export class RuleDefinition extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getArgumentsMap(): jspb.Map<string, AttributeTypeMap[keyof AttributeTypeMap]>;
  clearArgumentsMap(): void;
  hasExpression(): boolean;
  clearExpression(): void;
  getExpression(): google_api_expr_v1alpha1_checked_pb.CheckedExpr | undefined;
  setExpression(value?: google_api_expr_v1alpha1_checked_pb.CheckedExpr): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RuleDefinition.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RuleDefinition,
  ): RuleDefinition.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RuleDefinition,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RuleDefinition;
  static deserializeBinaryFromReader(
    message: RuleDefinition,
    reader: jspb.BinaryReader,
  ): RuleDefinition;
}

export namespace RuleDefinition {
  export type AsObject = {
    name: string;
    argumentsMap: Array<[string, AttributeTypeMap[keyof AttributeTypeMap]]>;
    expression?: google_api_expr_v1alpha1_checked_pb.CheckedExpr.AsObject;
  };
}

export class AttributeDefinition extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getType(): AttributeTypeMap[keyof AttributeTypeMap];
  setType(value: AttributeTypeMap[keyof AttributeTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttributeDefinition.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AttributeDefinition,
  ): AttributeDefinition.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AttributeDefinition,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): AttributeDefinition;
  static deserializeBinaryFromReader(
    message: AttributeDefinition,
    reader: jspb.BinaryReader,
  ): AttributeDefinition;
}

export namespace AttributeDefinition {
  export type AsObject = {
    name: string;
    type: AttributeTypeMap[keyof AttributeTypeMap];
  };
}

export class RelationDefinition extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearRelationReferencesList(): void;
  getRelationReferencesList(): Array<RelationReference>;
  setRelationReferencesList(value: Array<RelationReference>): void;
  addRelationReferences(
    value?: RelationReference,
    index?: number,
  ): RelationReference;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationDefinition.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationDefinition,
  ): RelationDefinition.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationDefinition,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationDefinition;
  static deserializeBinaryFromReader(
    message: RelationDefinition,
    reader: jspb.BinaryReader,
  ): RelationDefinition;
}

export namespace RelationDefinition {
  export type AsObject = {
    name: string;
    relationReferencesList: Array<RelationReference.AsObject>;
  };
}

export class PermissionDefinition extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  hasChild(): boolean;
  clearChild(): void;
  getChild(): Child | undefined;
  setChild(value?: Child): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PermissionDefinition.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: PermissionDefinition,
  ): PermissionDefinition.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: PermissionDefinition,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): PermissionDefinition;
  static deserializeBinaryFromReader(
    message: PermissionDefinition,
    reader: jspb.BinaryReader,
  ): PermissionDefinition;
}

export namespace PermissionDefinition {
  export type AsObject = {
    name: string;
    child?: Child.AsObject;
  };
}

export class RelationReference extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getRelation(): string;
  setRelation(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelationReference.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: RelationReference,
  ): RelationReference.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: RelationReference,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): RelationReference;
  static deserializeBinaryFromReader(
    message: RelationReference,
    reader: jspb.BinaryReader,
  ): RelationReference;
}

export namespace RelationReference {
  export type AsObject = {
    type: string;
    relation: string;
  };
}

export class Argument extends jspb.Message {
  hasComputedAttribute(): boolean;
  clearComputedAttribute(): void;
  getComputedAttribute(): ComputedAttribute | undefined;
  setComputedAttribute(value?: ComputedAttribute): void;

  hasContextAttribute(): boolean;
  clearContextAttribute(): void;
  getContextAttribute(): ContextAttribute | undefined;
  setContextAttribute(value?: ContextAttribute): void;

  getTypeCase(): Argument.TypeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Argument.AsObject;
  static toObject(includeInstance: boolean, msg: Argument): Argument.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Argument,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Argument;
  static deserializeBinaryFromReader(
    message: Argument,
    reader: jspb.BinaryReader,
  ): Argument;
}

export namespace Argument {
  export type AsObject = {
    computedAttribute?: ComputedAttribute.AsObject;
    contextAttribute?: ContextAttribute.AsObject;
  };

  export enum TypeCase {
    TYPE_NOT_SET = 0,
    COMPUTED_ATTRIBUTE = 1,
    CONTEXT_ATTRIBUTE = 2,
  }
}

export class Call extends jspb.Message {
  getRuleName(): string;
  setRuleName(value: string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<Argument>;
  setArgumentsList(value: Array<Argument>): void;
  addArguments(value?: Argument, index?: number): Argument;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Call.AsObject;
  static toObject(includeInstance: boolean, msg: Call): Call.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Call,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Call;
  static deserializeBinaryFromReader(
    message: Call,
    reader: jspb.BinaryReader,
  ): Call;
}

export namespace Call {
  export type AsObject = {
    ruleName: string;
    argumentsList: Array<Argument.AsObject>;
  };
}

export class ComputedAttribute extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComputedAttribute.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ComputedAttribute,
  ): ComputedAttribute.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ComputedAttribute,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ComputedAttribute;
  static deserializeBinaryFromReader(
    message: ComputedAttribute,
    reader: jspb.BinaryReader,
  ): ComputedAttribute;
}

export namespace ComputedAttribute {
  export type AsObject = {
    name: string;
  };
}

export class ContextAttribute extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContextAttribute.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ContextAttribute,
  ): ContextAttribute.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ContextAttribute,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ContextAttribute;
  static deserializeBinaryFromReader(
    message: ContextAttribute,
    reader: jspb.BinaryReader,
  ): ContextAttribute;
}

export namespace ContextAttribute {
  export type AsObject = {
    name: string;
  };
}

export class ComputedUserSet extends jspb.Message {
  getRelation(): string;
  setRelation(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComputedUserSet.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ComputedUserSet,
  ): ComputedUserSet.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ComputedUserSet,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ComputedUserSet;
  static deserializeBinaryFromReader(
    message: ComputedUserSet,
    reader: jspb.BinaryReader,
  ): ComputedUserSet;
}

export namespace ComputedUserSet {
  export type AsObject = {
    relation: string;
  };
}

export class TupleToUserSet extends jspb.Message {
  hasTupleset(): boolean;
  clearTupleset(): void;
  getTupleset(): TupleSet | undefined;
  setTupleset(value?: TupleSet): void;

  hasComputed(): boolean;
  clearComputed(): void;
  getComputed(): ComputedUserSet | undefined;
  setComputed(value?: ComputedUserSet): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TupleToUserSet.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TupleToUserSet,
  ): TupleToUserSet.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TupleToUserSet,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TupleToUserSet;
  static deserializeBinaryFromReader(
    message: TupleToUserSet,
    reader: jspb.BinaryReader,
  ): TupleToUserSet;
}

export namespace TupleToUserSet {
  export type AsObject = {
    tupleset?: TupleSet.AsObject;
    computed?: ComputedUserSet.AsObject;
  };
}

export class TupleSet extends jspb.Message {
  getRelation(): string;
  setRelation(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TupleSet.AsObject;
  static toObject(includeInstance: boolean, msg: TupleSet): TupleSet.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TupleSet,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TupleSet;
  static deserializeBinaryFromReader(
    message: TupleSet,
    reader: jspb.BinaryReader,
  ): TupleSet;
}

export namespace TupleSet {
  export type AsObject = {
    relation: string;
  };
}

export class Tuple extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  getRelation(): string;
  setRelation(value: string): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): Subject | undefined;
  setSubject(value?: Subject): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tuple.AsObject;
  static toObject(includeInstance: boolean, msg: Tuple): Tuple.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Tuple,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Tuple;
  static deserializeBinaryFromReader(
    message: Tuple,
    reader: jspb.BinaryReader,
  ): Tuple;
}

export namespace Tuple {
  export type AsObject = {
    entity?: Entity.AsObject;
    relation: string;
    subject?: Subject.AsObject;
  };
}

export class Attribute extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  getAttribute(): string;
  setAttribute(value: string): void;

  hasValue(): boolean;
  clearValue(): void;
  getValue(): google_protobuf_any_pb.Any | undefined;
  setValue(value?: google_protobuf_any_pb.Any): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Attribute.AsObject;
  static toObject(includeInstance: boolean, msg: Attribute): Attribute.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Attribute,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Attribute;
  static deserializeBinaryFromReader(
    message: Attribute,
    reader: jspb.BinaryReader,
  ): Attribute;
}

export namespace Attribute {
  export type AsObject = {
    entity?: Entity.AsObject;
    attribute: string;
    value?: google_protobuf_any_pb.Any.AsObject;
  };
}

export class Tuples extends jspb.Message {
  clearTuplesList(): void;
  getTuplesList(): Array<Tuple>;
  setTuplesList(value: Array<Tuple>): void;
  addTuples(value?: Tuple, index?: number): Tuple;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tuples.AsObject;
  static toObject(includeInstance: boolean, msg: Tuples): Tuples.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Tuples,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Tuples;
  static deserializeBinaryFromReader(
    message: Tuples,
    reader: jspb.BinaryReader,
  ): Tuples;
}

export namespace Tuples {
  export type AsObject = {
    tuplesList: Array<Tuple.AsObject>;
  };
}

export class Attributes extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<Attribute>;
  setAttributesList(value: Array<Attribute>): void;
  addAttributes(value?: Attribute, index?: number): Attribute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Attributes.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: Attributes,
  ): Attributes.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Attributes,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Attributes;
  static deserializeBinaryFromReader(
    message: Attributes,
    reader: jspb.BinaryReader,
  ): Attributes;
}

export namespace Attributes {
  export type AsObject = {
    attributesList: Array<Attribute.AsObject>;
  };
}

export class Entity extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Entity.AsObject;
  static toObject(includeInstance: boolean, msg: Entity): Entity.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Entity,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Entity;
  static deserializeBinaryFromReader(
    message: Entity,
    reader: jspb.BinaryReader,
  ): Entity;
}

export namespace Entity {
  export type AsObject = {
    type: string;
    id: string;
  };
}

export class EntityAndRelation extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  getRelation(): string;
  setRelation(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntityAndRelation.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EntityAndRelation,
  ): EntityAndRelation.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: EntityAndRelation,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): EntityAndRelation;
  static deserializeBinaryFromReader(
    message: EntityAndRelation,
    reader: jspb.BinaryReader,
  ): EntityAndRelation;
}

export namespace EntityAndRelation {
  export type AsObject = {
    entity?: Entity.AsObject;
    relation: string;
  };
}

export class Subject extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getId(): string;
  setId(value: string): void;

  getRelation(): string;
  setRelation(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Subject.AsObject;
  static toObject(includeInstance: boolean, msg: Subject): Subject.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Subject,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Subject;
  static deserializeBinaryFromReader(
    message: Subject,
    reader: jspb.BinaryReader,
  ): Subject;
}

export namespace Subject {
  export type AsObject = {
    type: string;
    id: string;
    relation: string;
  };
}

export class AttributeFilter extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): EntityFilter | undefined;
  setEntity(value?: EntityFilter): void;

  clearAttributesList(): void;
  getAttributesList(): Array<string>;
  setAttributesList(value: Array<string>): void;
  addAttributes(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AttributeFilter.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: AttributeFilter,
  ): AttributeFilter.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: AttributeFilter,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): AttributeFilter;
  static deserializeBinaryFromReader(
    message: AttributeFilter,
    reader: jspb.BinaryReader,
  ): AttributeFilter;
}

export namespace AttributeFilter {
  export type AsObject = {
    entity?: EntityFilter.AsObject;
    attributesList: Array<string>;
  };
}

export class TupleFilter extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): EntityFilter | undefined;
  setEntity(value?: EntityFilter): void;

  getRelation(): string;
  setRelation(value: string): void;

  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): SubjectFilter | undefined;
  setSubject(value?: SubjectFilter): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TupleFilter.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: TupleFilter,
  ): TupleFilter.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: TupleFilter,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TupleFilter;
  static deserializeBinaryFromReader(
    message: TupleFilter,
    reader: jspb.BinaryReader,
  ): TupleFilter;
}

export namespace TupleFilter {
  export type AsObject = {
    entity?: EntityFilter.AsObject;
    relation: string;
    subject?: SubjectFilter.AsObject;
  };
}

export class EntityFilter extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  clearIdsList(): void;
  getIdsList(): Array<string>;
  setIdsList(value: Array<string>): void;
  addIds(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EntityFilter.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: EntityFilter,
  ): EntityFilter.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: EntityFilter,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): EntityFilter;
  static deserializeBinaryFromReader(
    message: EntityFilter,
    reader: jspb.BinaryReader,
  ): EntityFilter;
}

export namespace EntityFilter {
  export type AsObject = {
    type: string;
    idsList: Array<string>;
  };
}

export class SubjectFilter extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  clearIdsList(): void;
  getIdsList(): Array<string>;
  setIdsList(value: Array<string>): void;
  addIds(value: string, index?: number): string;

  getRelation(): string;
  setRelation(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubjectFilter.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: SubjectFilter,
  ): SubjectFilter.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: SubjectFilter,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): SubjectFilter;
  static deserializeBinaryFromReader(
    message: SubjectFilter,
    reader: jspb.BinaryReader,
  ): SubjectFilter;
}

export namespace SubjectFilter {
  export type AsObject = {
    type: string;
    idsList: Array<string>;
    relation: string;
  };
}

export class ExpandTreeNode extends jspb.Message {
  getOperation(): ExpandTreeNode.OperationMap[keyof ExpandTreeNode.OperationMap];
  setOperation(
    value: ExpandTreeNode.OperationMap[keyof ExpandTreeNode.OperationMap],
  ): void;

  clearChildrenList(): void;
  getChildrenList(): Array<Expand>;
  setChildrenList(value: Array<Expand>): void;
  addChildren(value?: Expand, index?: number): Expand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExpandTreeNode.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ExpandTreeNode,
  ): ExpandTreeNode.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ExpandTreeNode,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ExpandTreeNode;
  static deserializeBinaryFromReader(
    message: ExpandTreeNode,
    reader: jspb.BinaryReader,
  ): ExpandTreeNode;
}

export namespace ExpandTreeNode {
  export type AsObject = {
    operation: ExpandTreeNode.OperationMap[keyof ExpandTreeNode.OperationMap];
    childrenList: Array<Expand.AsObject>;
  };

  export interface OperationMap {
    OPERATION_UNSPECIFIED: 0;
    OPERATION_UNION: 1;
    OPERATION_INTERSECTION: 2;
    OPERATION_EXCLUSION: 3;
  }

  export const Operation: OperationMap;
}

export class Expand extends jspb.Message {
  hasEntity(): boolean;
  clearEntity(): void;
  getEntity(): Entity | undefined;
  setEntity(value?: Entity): void;

  getPermission(): string;
  setPermission(value: string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<Argument>;
  setArgumentsList(value: Array<Argument>): void;
  addArguments(value?: Argument, index?: number): Argument;

  hasExpand(): boolean;
  clearExpand(): void;
  getExpand(): ExpandTreeNode | undefined;
  setExpand(value?: ExpandTreeNode): void;

  hasLeaf(): boolean;
  clearLeaf(): void;
  getLeaf(): ExpandLeaf | undefined;
  setLeaf(value?: ExpandLeaf): void;

  getNodeCase(): Expand.NodeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Expand.AsObject;
  static toObject(includeInstance: boolean, msg: Expand): Expand.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Expand,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Expand;
  static deserializeBinaryFromReader(
    message: Expand,
    reader: jspb.BinaryReader,
  ): Expand;
}

export namespace Expand {
  export type AsObject = {
    entity?: Entity.AsObject;
    permission: string;
    argumentsList: Array<Argument.AsObject>;
    expand?: ExpandTreeNode.AsObject;
    leaf?: ExpandLeaf.AsObject;
  };

  export enum NodeCase {
    NODE_NOT_SET = 0,
    EXPAND = 4,
    LEAF = 5,
  }
}

export class ExpandLeaf extends jspb.Message {
  hasSubjects(): boolean;
  clearSubjects(): void;
  getSubjects(): Subjects | undefined;
  setSubjects(value?: Subjects): void;

  hasValues(): boolean;
  clearValues(): void;
  getValues(): Values | undefined;
  setValues(value?: Values): void;

  hasValue(): boolean;
  clearValue(): void;
  getValue(): google_protobuf_any_pb.Any | undefined;
  setValue(value?: google_protobuf_any_pb.Any): void;

  getTypeCase(): ExpandLeaf.TypeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExpandLeaf.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ExpandLeaf,
  ): ExpandLeaf.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ExpandLeaf,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ExpandLeaf;
  static deserializeBinaryFromReader(
    message: ExpandLeaf,
    reader: jspb.BinaryReader,
  ): ExpandLeaf;
}

export namespace ExpandLeaf {
  export type AsObject = {
    subjects?: Subjects.AsObject;
    values?: Values.AsObject;
    value?: google_protobuf_any_pb.Any.AsObject;
  };

  export enum TypeCase {
    TYPE_NOT_SET = 0,
    SUBJECTS = 1,
    VALUES = 2,
    VALUE = 3,
  }
}

export class Values extends jspb.Message {
  getValuesMap(): jspb.Map<string, google_protobuf_any_pb.Any>;
  clearValuesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Values.AsObject;
  static toObject(includeInstance: boolean, msg: Values): Values.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Values,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Values;
  static deserializeBinaryFromReader(
    message: Values,
    reader: jspb.BinaryReader,
  ): Values;
}

export namespace Values {
  export type AsObject = {
    valuesMap: Array<[string, google_protobuf_any_pb.Any.AsObject]>;
  };
}

export class Subjects extends jspb.Message {
  clearSubjectsList(): void;
  getSubjectsList(): Array<Subject>;
  setSubjectsList(value: Array<Subject>): void;
  addSubjects(value?: Subject, index?: number): Subject;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Subjects.AsObject;
  static toObject(includeInstance: boolean, msg: Subjects): Subjects.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Subjects,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Subjects;
  static deserializeBinaryFromReader(
    message: Subjects,
    reader: jspb.BinaryReader,
  ): Subjects;
}

export namespace Subjects {
  export type AsObject = {
    subjectsList: Array<Subject.AsObject>;
  };
}

export class Tenant extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tenant.AsObject;
  static toObject(includeInstance: boolean, msg: Tenant): Tenant.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Tenant,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Tenant;
  static deserializeBinaryFromReader(
    message: Tenant,
    reader: jspb.BinaryReader,
  ): Tenant;
}

export namespace Tenant {
  export type AsObject = {
    id: string;
    name: string;
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}

export class DataChanges extends jspb.Message {
  getSnapToken(): string;
  setSnapToken(value: string): void;

  clearDataChangesList(): void;
  getDataChangesList(): Array<DataChange>;
  setDataChangesList(value: Array<DataChange>): void;
  addDataChanges(value?: DataChange, index?: number): DataChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataChanges.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataChanges,
  ): DataChanges.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataChanges,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataChanges;
  static deserializeBinaryFromReader(
    message: DataChanges,
    reader: jspb.BinaryReader,
  ): DataChanges;
}

export namespace DataChanges {
  export type AsObject = {
    snapToken: string;
    dataChangesList: Array<DataChange.AsObject>;
  };
}

export class DataChange extends jspb.Message {
  getOperation(): DataChange.OperationMap[keyof DataChange.OperationMap];
  setOperation(
    value: DataChange.OperationMap[keyof DataChange.OperationMap],
  ): void;

  hasTuple(): boolean;
  clearTuple(): void;
  getTuple(): Tuple | undefined;
  setTuple(value?: Tuple): void;

  hasAttribute(): boolean;
  clearAttribute(): void;
  getAttribute(): Attribute | undefined;
  setAttribute(value?: Attribute): void;

  getTypeCase(): DataChange.TypeCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataChange.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataChange,
  ): DataChange.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataChange,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataChange;
  static deserializeBinaryFromReader(
    message: DataChange,
    reader: jspb.BinaryReader,
  ): DataChange;
}

export namespace DataChange {
  export type AsObject = {
    operation: DataChange.OperationMap[keyof DataChange.OperationMap];
    tuple?: Tuple.AsObject;
    attribute?: Attribute.AsObject;
  };

  export interface OperationMap {
    OPERATION_UNSPECIFIED: 0;
    OPERATION_CREATE: 1;
    OPERATION_DELETE: 2;
  }

  export const Operation: OperationMap;

  export enum TypeCase {
    TYPE_NOT_SET = 0,
    TUPLE = 2,
    ATTRIBUTE = 3,
  }
}

export class StringValue extends jspb.Message {
  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StringValue,
  ): StringValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StringValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): StringValue;
  static deserializeBinaryFromReader(
    message: StringValue,
    reader: jspb.BinaryReader,
  ): StringValue;
}

export namespace StringValue {
  export type AsObject = {
    data: string;
  };
}

export class IntegerValue extends jspb.Message {
  getData(): number;
  setData(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IntegerValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: IntegerValue,
  ): IntegerValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: IntegerValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): IntegerValue;
  static deserializeBinaryFromReader(
    message: IntegerValue,
    reader: jspb.BinaryReader,
  ): IntegerValue;
}

export namespace IntegerValue {
  export type AsObject = {
    data: number;
  };
}

export class DoubleValue extends jspb.Message {
  getData(): number;
  setData(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DoubleValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DoubleValue,
  ): DoubleValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DoubleValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DoubleValue;
  static deserializeBinaryFromReader(
    message: DoubleValue,
    reader: jspb.BinaryReader,
  ): DoubleValue;
}

export namespace DoubleValue {
  export type AsObject = {
    data: number;
  };
}

export class BooleanValue extends jspb.Message {
  getData(): boolean;
  setData(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BooleanValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BooleanValue,
  ): BooleanValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BooleanValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BooleanValue;
  static deserializeBinaryFromReader(
    message: BooleanValue,
    reader: jspb.BinaryReader,
  ): BooleanValue;
}

export namespace BooleanValue {
  export type AsObject = {
    data: boolean;
  };
}

export class StringArrayValue extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<string>;
  setDataList(value: Array<string>): void;
  addData(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StringArrayValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StringArrayValue,
  ): StringArrayValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StringArrayValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): StringArrayValue;
  static deserializeBinaryFromReader(
    message: StringArrayValue,
    reader: jspb.BinaryReader,
  ): StringArrayValue;
}

export namespace StringArrayValue {
  export type AsObject = {
    dataList: Array<string>;
  };
}

export class IntegerArrayValue extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<number>;
  setDataList(value: Array<number>): void;
  addData(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IntegerArrayValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: IntegerArrayValue,
  ): IntegerArrayValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: IntegerArrayValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): IntegerArrayValue;
  static deserializeBinaryFromReader(
    message: IntegerArrayValue,
    reader: jspb.BinaryReader,
  ): IntegerArrayValue;
}

export namespace IntegerArrayValue {
  export type AsObject = {
    dataList: Array<number>;
  };
}

export class DoubleArrayValue extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<number>;
  setDataList(value: Array<number>): void;
  addData(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DoubleArrayValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DoubleArrayValue,
  ): DoubleArrayValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DoubleArrayValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DoubleArrayValue;
  static deserializeBinaryFromReader(
    message: DoubleArrayValue,
    reader: jspb.BinaryReader,
  ): DoubleArrayValue;
}

export namespace DoubleArrayValue {
  export type AsObject = {
    dataList: Array<number>;
  };
}

export class BooleanArrayValue extends jspb.Message {
  clearDataList(): void;
  getDataList(): Array<boolean>;
  setDataList(value: Array<boolean>): void;
  addData(value: boolean, index?: number): boolean;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BooleanArrayValue.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: BooleanArrayValue,
  ): BooleanArrayValue.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: BooleanArrayValue,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): BooleanArrayValue;
  static deserializeBinaryFromReader(
    message: BooleanArrayValue,
    reader: jspb.BinaryReader,
  ): BooleanArrayValue;
}

export namespace BooleanArrayValue {
  export type AsObject = {
    dataList: Array<boolean>;
  };
}

export class DataBundle extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<string>;
  setArgumentsList(value: Array<string>): void;
  addArguments(value: string, index?: number): string;

  clearOperationsList(): void;
  getOperationsList(): Array<Operation>;
  setOperationsList(value: Array<Operation>): void;
  addOperations(value?: Operation, index?: number): Operation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataBundle.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: DataBundle,
  ): DataBundle.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: DataBundle,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): DataBundle;
  static deserializeBinaryFromReader(
    message: DataBundle,
    reader: jspb.BinaryReader,
  ): DataBundle;
}

export namespace DataBundle {
  export type AsObject = {
    name: string;
    argumentsList: Array<string>;
    operationsList: Array<Operation.AsObject>;
  };
}

export class Operation extends jspb.Message {
  clearRelationshipsWriteList(): void;
  getRelationshipsWriteList(): Array<string>;
  setRelationshipsWriteList(value: Array<string>): void;
  addRelationshipsWrite(value: string, index?: number): string;

  clearRelationshipsDeleteList(): void;
  getRelationshipsDeleteList(): Array<string>;
  setRelationshipsDeleteList(value: Array<string>): void;
  addRelationshipsDelete(value: string, index?: number): string;

  clearAttributesWriteList(): void;
  getAttributesWriteList(): Array<string>;
  setAttributesWriteList(value: Array<string>): void;
  addAttributesWrite(value: string, index?: number): string;

  clearAttributesDeleteList(): void;
  getAttributesDeleteList(): Array<string>;
  setAttributesDeleteList(value: Array<string>): void;
  addAttributesDelete(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Operation.AsObject;
  static toObject(includeInstance: boolean, msg: Operation): Operation.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Operation,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Operation;
  static deserializeBinaryFromReader(
    message: Operation,
    reader: jspb.BinaryReader,
  ): Operation;
}

export namespace Operation {
  export type AsObject = {
    relationshipsWriteList: Array<string>;
    relationshipsDeleteList: Array<string>;
    attributesWriteList: Array<string>;
    attributesDeleteList: Array<string>;
  };
}

export class Partials extends jspb.Message {
  clearWriteList(): void;
  getWriteList(): Array<string>;
  setWriteList(value: Array<string>): void;
  addWrite(value: string, index?: number): string;

  clearDeleteList(): void;
  getDeleteList(): Array<string>;
  setDeleteList(value: Array<string>): void;
  addDelete(value: string, index?: number): string;

  clearUpdateList(): void;
  getUpdateList(): Array<string>;
  setUpdateList(value: Array<string>): void;
  addUpdate(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Partials.AsObject;
  static toObject(includeInstance: boolean, msg: Partials): Partials.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Partials,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): Partials;
  static deserializeBinaryFromReader(
    message: Partials,
    reader: jspb.BinaryReader,
  ): Partials;
}

export namespace Partials {
  export type AsObject = {
    writeList: Array<string>;
    deleteList: Array<string>;
    updateList: Array<string>;
  };
}

export interface CheckResultMap {
  CHECK_RESULT_UNSPECIFIED: 0;
  CHECK_RESULT_ALLOWED: 1;
  CHECK_RESULT_DENIED: 2;
}

export const CheckResult: CheckResultMap;

export interface AttributeTypeMap {
  ATTRIBUTE_TYPE_UNSPECIFIED: 0;
  ATTRIBUTE_TYPE_BOOLEAN: 1;
  ATTRIBUTE_TYPE_BOOLEAN_ARRAY: 2;
  ATTRIBUTE_TYPE_STRING: 3;
  ATTRIBUTE_TYPE_STRING_ARRAY: 4;
  ATTRIBUTE_TYPE_INTEGER: 5;
  ATTRIBUTE_TYPE_INTEGER_ARRAY: 6;
  ATTRIBUTE_TYPE_DOUBLE: 7;
  ATTRIBUTE_TYPE_DOUBLE_ARRAY: 8;
}

export const AttributeType: AttributeTypeMap;
