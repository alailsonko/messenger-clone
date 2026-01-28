#!/bin/bash
set -e

PRIMARY_HOST=${PRIMARY_HOST:-db}
PRIMARY_PORT=${PRIMARY_PORT:-5432}
REPLICA_USER=${REPLICA_USER:-replicator}
REPLICA_PASSWORD=${REPLICA_PASSWORD:-replica_password}
PGDATA=${PGDATA:-/var/lib/postgresql/data/pgdata}

export PGPASSWORD="$REPLICA_PASSWORD"

mkdir -p "$PGDATA"
chown -R postgres:postgres "$PGDATA"

if [ -z "$(ls -A "$PGDATA")" ]; then
  echo "PGDATA is empty — performing base backup from $PRIMARY_HOST:$PRIMARY_PORT"
  until pg_isready -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "$REPLICA_USER" >/dev/null 2>&1; do
    echo "Waiting for primary $PRIMARY_HOST:$PRIMARY_PORT..."
    sleep 1
  done

  gosu postgres pg_basebackup -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -D "$PGDATA" -U "$REPLICA_USER" -v -P --wal-method=stream

  touch "$PGDATA/standby.signal"

  echo "primary_conninfo = 'host=$PRIMARY_HOST port=$PRIMARY_PORT user=$REPLICA_USER password=$REPLICA_PASSWORD sslmode=prefer'" >> "$PGDATA/postgresql.auto.conf"
  echo "hot_standby = on" >> "$PGDATA/postgresql.auto.conf"
  echo "max_connections = 500" >> "$PGDATA/postgresql.auto.conf"

  chown -R postgres:postgres "$PGDATA"
fi

exec docker-entrypoint.sh postgres
