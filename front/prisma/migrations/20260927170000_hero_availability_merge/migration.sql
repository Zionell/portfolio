-- AlterTable
ALTER TABLE "HomeHero" ADD COLUMN     "availabilityFacts" TEXT[],
ADD COLUMN     "availabilityOpen" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "availabilityStatus" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "availabilityVisible" BOOLEAN NOT NULL DEFAULT true;

-- Переносим плашку availability в hero того же языка. Если hero для языка
-- ещё не заведён — создаём пустой, чтобы данные не потерялись.
INSERT INTO "HomeHero" ("id", "title", "subtitle", "lang", "updatedAt",
    "availabilityVisible", "availabilityOpen", "availabilityStatus", "availabilityFacts")
SELECT a."id", '', '', a."lang", NOW(),
    a."isVisible", a."isOpen", a."status", a."facts"
FROM "HomeAvailability" a
ON CONFLICT ("lang") DO UPDATE SET
    "availabilityVisible" = EXCLUDED."availabilityVisible",
    "availabilityOpen"    = EXCLUDED."availabilityOpen",
    "availabilityStatus"  = EXCLUDED."availabilityStatus",
    "availabilityFacts"   = EXCLUDED."availabilityFacts";

-- DropTable
DROP TABLE "HomeAvailability";
