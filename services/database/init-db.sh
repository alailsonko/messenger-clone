#!/bin/bash
set -e

# Check if required environment variables are set
if [ -z "$POSTGRES_USER" ]; then
  echo "Error: POSTGRES_USER is not set."
  exit 1
fi

if [ -z "$POSTGRES_DB" ]; then
  echo "Error: POSTGRES_DB is not set."
  exit 1
fi

echo "Creating databases..."

# Function to create a database
create_database() {
  local db_name=$1
  echo "Creating database $db_name..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "CREATE DATABASE $db_name;"
  echo "Database $db_name created successfully."
}

# List of databases to create
databases=("accounts" "chats" "orchestrator" "posts" "rbac" "users" "authentication" "auth")

# Loop through the list and create each database
for db in "${databases[@]}"; do
  create_database "$db"
done

echo "All databases created successfully."