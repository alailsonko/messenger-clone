FROM node:latest AS build

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn run all:build

FROM node:latest

WORKDIR /app

COPY --from=build /app ./

CMD ["node", "services/posts/dist/main.js"]