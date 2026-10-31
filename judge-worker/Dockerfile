FROM node:20-alpine

# Install build essentials, python, gcc, g++, openjdk, and docker cli
RUN apk add --no-cache \
    python3 \
    gcc \
    g++ \
    musl-dev \
    openjdk17 \
    docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "worker.js"]
