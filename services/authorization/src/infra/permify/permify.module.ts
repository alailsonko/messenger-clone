import { Module } from '@nestjs/common';
import { BundlePermify } from './bundle.permify';
import { DataPermify } from './data.permify';
import { HealthPermify } from './health.permify';
import { PermissionPermify } from './permission.permify';
import { SchemaPermify } from './schema.permify';
import { TenancyPermify } from './tenancy.permify';
import { WatchPermify } from './watch.permify';

@Module({
  exports: [
    BundlePermify,
    DataPermify,
    HealthPermify,
    PermissionPermify,
    SchemaPermify,
    TenancyPermify,
    WatchPermify,
  ],
  providers: [
    BundlePermify,
    DataPermify,
    HealthPermify,
    PermissionPermify,
    SchemaPermify,
    TenancyPermify,
    WatchPermify,
  ],
})
export class PermifyModule {}
