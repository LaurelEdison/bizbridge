# backend/Dockerfile
# ---- Build stage ----
FROM golang:1.25.1 AS builder
WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build binary
RUN go build -o server ./server

# ---- Runtime stage ----
FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
CMD ["./server"]
