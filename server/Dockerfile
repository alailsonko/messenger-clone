# ----------- Build Stage -----------
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o messenger-api ./cmd/api

# ----------- Development Stage (for hot reload) -----------
FROM golang:1.25-alpine AS dev
WORKDIR /app
RUN apk add --no-cache curl
ENV PATH="/go/bin:${PATH}"
COPY go.mod go.sum ./
RUN go mod download
RUN go install github.com/air-verse/air@latest
COPY . .
EXPOSE 8080
CMD ["air", "-c", ".air.toml"]

# ----------- Production Stage (optimized binary with prefork) -----------
FROM alpine:3.19 AS production
WORKDIR /app
# Install ca-certificates for HTTPS, curl for healthchecks, and tini for init
# Tini is required for prefork mode in Docker - it becomes PID 1 so child processes
# can correctly detect parent death (Fiber's prefork checks if ppid == 1)
RUN apk add --no-cache ca-certificates curl tini
COPY --from=builder /app/messenger-api .
EXPOSE 8080
# Use tini as init system for proper signal handling and prefork compatibility
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./messenger-api"]
