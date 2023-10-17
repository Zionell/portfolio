FROM node:18.18.0-alpine

WORKDIR /app

ARG IMGPROXY_SITE_HOST
ENV IMGPROXY_SITE_HOST=$IMGPROXY_SITE_HOST
ARG SERVER_API
ENV SERVER_API=$SERVER_API

RUN apk update && apk upgrade
RUN apk add git

COPY ./package*.json /app/

RUN npm ci && npm cache clean --force

COPY .. .

EXPOSE 3000

RUN npm run build

ENTRYPOINT ["node", ".output/server/index.mjs"]
