-- This is an empty migration.
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

CREATE SERVER users_db_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'postgres', port '5432', dbname 'users');

CREATE USER MAPPING FOR admin
SERVER users_db_server
OPTIONS (user 'admin', password 'admin');

