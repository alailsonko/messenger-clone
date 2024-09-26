# Stage 1: Build the application
FROM node:latest AS builder

# Set working directory
WORKDIR /app

RUN yarn install

# Copy the rest of the application code
COPY . .

RUN yarn install

# Build the Next.js application
RUN yarn run all:build

# Stage 2: Serve the application
FROM node:latest

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "run", "web:start:prod"]