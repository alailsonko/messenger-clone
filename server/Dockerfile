# ----------- Build Stage -----------
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o messenger-api ./cmd/api

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
