FROM node:latest AS builder

WORKDIR /app

COPY . .

RUN yarn && npx prisma generate && yarn build

FROM node:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN yarn install --production

CMD ["node", "dist/src/main"]