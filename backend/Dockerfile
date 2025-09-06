# backend/Dockerfile - development-friendly Node image
FROM node:20-alpine

# create app directory
WORKDIR /usr/src/app

# Install dependencies first (cache)
COPY package*.json ./
RUN npm ci --silent

# Copy rest of backend
COPY . .

# If you use compiled sources, build step can go here (e.g. TypeScript)
# RUN npm run build

# Expose backend port (change if your server uses another port)
EXPOSE 5000

# Use nodemon in development if available; otherwise npm run dev
# The command assumes package.json has "dev" script (e.g. nodemon src/index.js)
CMD ["sh", "-c", "npm run dev"]
