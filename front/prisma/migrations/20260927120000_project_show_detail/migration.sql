-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "showDetail" BOOLEAN NOT NULL DEFAULT false;

-- Раньше страница появлялась сама, если было что показать —
-- сохраняем это поведение для уже заполненных проектов
UPDATE "Project" p SET "showDetail" = true
WHERE COALESCE(TRIM(p."description_en"), '') <> ''
   OR COALESCE(TRIM(p."description_ru"), '') <> ''
   OR EXISTS (SELECT 1 FROM "ProjectBlock" b WHERE b."projectId" = p.id)
   OR EXISTS (SELECT 1 FROM "ProjectImage" i WHERE i."projectId" = p.id);
