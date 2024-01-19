# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install the project dependencies
RUN yarn

# Define the command to run your application
CMD ["yarn", "start"]
