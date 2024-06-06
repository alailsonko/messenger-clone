#!/bin/bash

until rm -rf /var/lib/postgresql/data/* && pg_basebackup -U postgres --pgdata=/var/lib/postgresql/data -R --slot=replication_slot --host=$DATABASE_HOST_MASTER --port=$DATABASE_PORT_MASTER;
do
  echo 'Waiting for primary to connect...'
  sleep 1s
done

echo 'Backup done, starting replica...'

chown -R postgres:postgres /var/lib/postgresql/data

chmod 0700 /var/lib/postgresql/data

gosu postgres postgres