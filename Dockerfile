ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY . .

RUN corepack enable

RUN pnpm install --production
RUN pnpm run build

COPY ./dist ./dist

CMD ["pnpm", "start"]

EXPOSE 3000