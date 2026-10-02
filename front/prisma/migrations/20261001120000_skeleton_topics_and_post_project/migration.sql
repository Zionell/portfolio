-- AlterTable
ALTER TABLE "PostSkeleton" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'ru',
ADD COLUMN     "projectId" TEXT,
ALTER COLUMN "repo_name" DROP NOT NULL,
ALTER COLUMN "commits" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "projectId" TEXT;

-- CreateIndex
CREATE INDEX "PostSkeleton_projectId_idx" ON "PostSkeleton"("projectId");

-- CreateIndex
CREATE INDEX "Posts_projectId_idx" ON "Posts"("projectId");

-- AddForeignKey
ALTER TABLE "PostSkeleton" ADD CONSTRAINT "PostSkeleton_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Скелетоны из PR приходили с именем репозитория: связываем с проектом,
-- если slug совпадает
UPDATE "PostSkeleton" AS s
SET "projectId" = p."id"
FROM "Project" AS p
WHERE s."projectId" IS NULL
  AND s."repo_name" IS NOT NULL
  AND lower(s."repo_name") = lower(p."slug");
