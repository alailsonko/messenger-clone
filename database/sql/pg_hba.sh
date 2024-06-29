#!/bin/sh

echo "host    replication     all             0.0.0.0/0               trust" >> /var/lib/postgresql/data/pg_hba.conf

echo "Entry added to pg_hba.conf successfully."