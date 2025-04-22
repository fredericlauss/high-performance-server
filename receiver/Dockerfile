FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

RUN mkdir -p received/websocket && chown -R node:node received

USER node

CMD ["node", "dist/server.js"] 