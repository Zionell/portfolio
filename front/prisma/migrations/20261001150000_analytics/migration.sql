-- CreateTable
CREATE TABLE "SiteVisitDay" (
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteVisitDay_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "PostViewDay" (
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostViewDay_pkey" PRIMARY KEY ("postId","date")
);

-- CreateTable
CREATE TABLE "PostGenerationError" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostGenerationError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostViewDay_date_idx" ON "PostViewDay"("date");

-- CreateIndex
CREATE INDEX "PostGenerationError_createdAt_idx" ON "PostGenerationError"("createdAt");

-- AddForeignKey
ALTER TABLE "PostViewDay" ADD CONSTRAINT "PostViewDay_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Яндекс.Метрика теперь подключается из кода (NUXT_PUBLIC_YANDEX_METRIKA_ID),
-- копия в скриптах админки отправляла бы данные дважды
DELETE FROM "SettingsScripts" WHERE "innerHTML" LIKE '%mc.yandex.%';
