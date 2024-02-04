import { IsUUID, IsString, IsDate, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentTypeAbstract } from './contentTypes.abstract';
import { IAdminLog } from '../adminLogs/adminLogs.interface';
import { IPermission } from '../permissions/permissions.interface';
import { OPERATIONS } from 'src/common/enums/operations.enum';
import { AdminLogsEntity } from '../adminLogs/adminLogs.entity';

export class ContentTypeEntity extends ContentTypeAbstract {
  @IsUUID('4', { groups: [OPERATIONS.READ] })
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get appLabel(): string {
    return this._appLabel;
  }
  set appLabel(value: string) {
    this._appLabel = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get model(): string {
    return this._model;
  }
  set model(value: string) {
    this._model = value;
  }

  @IsString({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(value: Date) {
    this._createdAt = value;
  }

  @IsDate({ groups: [OPERATIONS.READ] })
  @Type(() => Date)
  get updatedAt(): Date {
    return this._updatedAt;
  }
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  @IsOptional({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get permission(): IPermission | null {
    return this._permission;
  }
  set permission(value: IPermission | null) {
    this._permission = value;
  }

  @IsUUID('4', { groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  @IsOptional({ groups: [OPERATIONS.CREATE, OPERATIONS.UPDATE] })
  get permissionId(): string | null {
    return this._permissionId;
  }
  set permissionId(value: string | null) {
    this._permissionId = value;
  }

  @IsArray({ groups: [OPERATIONS.READ] })
  @Type(() => AdminLogsEntity)
  get adminLog(): IAdminLog[] {
    return this._adminLog;
  }
  set adminLog(value: IAdminLog[]) {
    this._adminLog = value;
  }
}
