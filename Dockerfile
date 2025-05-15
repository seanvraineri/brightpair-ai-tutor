# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (for React, TypeScript, etc.)
RUN npm run build

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 