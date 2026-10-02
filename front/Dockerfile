# ---------- BUILD ----------
FROM node:26-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run prisma-generate

RUN npm run build


# ---------- MIGRATE ----------
# одноразовый контейнер: накатывает миграции до старта frontend,
# в runtime-образе prisma CLI нет
FROM build AS migrate

CMD ["npx", "prisma", "migrate", "deploy"]


# ---------- RUNTIME ----------
FROM node:26-alpine AS runtime

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/generated ./generated

CMD ["node", ".output/server/index.mjs"]
