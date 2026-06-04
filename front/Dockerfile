# ---------- BUILD ----------
FROM node:22.18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run prisma-generate

RUN npm run build


# ---------- RUNTIME ----------
FROM node:22.18-alpine

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/generated ./generated

CMD ["node", ".output/server/index.mjs"]
