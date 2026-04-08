FROM node:18-alpine

WORKDIR /app

# Copy package files separately to leverage Docker cache
COPY package*.json ./

RUN npm install --production

# Copy the rest of the servercode
COPY . .

# Expose the API port
EXPOSE 5000

CMD ["npm", "start"]
