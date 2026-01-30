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

# Create the proper pg_hba.conf with Docker network trust rule
cat > "$PGDATA/pg_hba.conf" <<- 'EOP'
# PostgreSQL Client Authentication Configuration File
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust

# Replication
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust
host    replication     replicator      0.0.0.0/0               md5

# Docker internal network - trust for PgBouncer connections
# IMPORTANT: This rule must come BEFORE the 0.0.0.0/0 rule
host    all             all             172.16.0.0/12           trust

# External connections
host    all             all             0.0.0.0/0               scram-sha-256
EOP

chown postgres:postgres "$PGDATA/pg_hba.conf"

pg_ctl -D "$PGDATA" reload || true
