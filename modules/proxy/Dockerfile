FROM rust:latest

# Install bacon and dependencies
RUN cargo install bacon && \
    apt-get update && \
    apt-get install -y inotify-tools cmake make lsof

WORKDIR /app
COPY . .

# Copy and make our start script executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Make sure the script is executable
RUN chmod +x start.sh

CMD ["/app/start.sh"]
