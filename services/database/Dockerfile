FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin
ENV POSTGRES_DB=postgres

# Copy initialization scripts
COPY init-db.sh /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432