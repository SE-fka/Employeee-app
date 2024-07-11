# Use a Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the Angular application files
COPY . .

# Build the Angular application
RUN npm run build --prod

# Install the http-server package
RUN npm install -g http-server

# Start the Angular application and JSON-server
CMD ["sh", "-c", "http-server dist/employee-management -p 4200 & json-server --watch db.json"]

# Expose the ports
EXPOSE 4200 3000