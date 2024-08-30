#!/bin/bash
set -e

# Create databases for each service
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE accounts;
    CREATE DATABASE chats;
    CREATE DATABASE orchestrator;
    CREATE DATABASE posts;
    CREATE DATABASE rbac;
    CREATE DATABASE users;
EOSQL