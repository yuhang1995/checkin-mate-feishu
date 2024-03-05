ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY . .

RUN yarn install --production

CMD ["node", "index.mjs"]

EXPOSE 3000