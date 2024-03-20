FROM node:18-alpine as builder
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/src/database ./database
COPY --from=builder /usr/src/app/scripts ./scripts
RUN chmod +x ./scripts/migrate.sh

RUN npm install
EXPOSE 3000
CMD npm start