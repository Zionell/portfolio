FROM node:22.18

WORKDIR /app

ARG SERVER_API
ENV SERVER_API=$SERVER_API

RUN apt-get update && apt-get upgrade -y

COPY ./package*.json /app/

RUN npm ci && npm cache clean --force

COPY .. .

EXPOSE 3000

RUN npm run build

ENTRYPOINT ["node", ".output/server/index.mjs"]
