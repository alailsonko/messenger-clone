CREATE USER replicator WITH REPLICATION PASSWORD 'replicator_password';

SELECT pg_create_physical_replication_slot('replication_slot');
