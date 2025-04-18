# Development stage
FROM rust:1.86-slim as dev

# Update package manager to minimize vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean

WORKDIR /app
RUN cargo install cargo-watch

COPY . .

# Use this for development with hot reload
CMD ["cargo", "watch", "-x", "run"]
