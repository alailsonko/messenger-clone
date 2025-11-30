#!/bin/bash
set -e

until pg_isready --username="$POSTGRES_USER" --dbname="$POSTGRES_DB"; do
  sleep 1
done

psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<- EOSQL
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET max_wal_senders = '10';
ALTER SYSTEM SET max_replication_slots = '10';
EOSQL

pg_ctl -D "$PGDATA" reload || true

cat >> "$PGDATA/pg_hba.conf" <<- 'EOP'
# allow replication connections from all IPs
host replication replicator 0.0.0.0/0 md5
EOP

chown postgres:postgres "$PGDATA/pg_hba.conf"

pg_ctl -D "$PGDATA" reload || true
