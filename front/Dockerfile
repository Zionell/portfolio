# ---------- BUILD ----------
FROM node:22.18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------- RUNTIME ----------
FROM node:22.18-alpine

WORKDIR /app

COPY --from=build /app/.output ./.output

CMD ["node", ".output/server/index.mjs"]
