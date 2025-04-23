FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install -g typescript

RUN npm run build

RUN npm ci --only=production

USER node

CMD ["node", "dist/server.js"] 