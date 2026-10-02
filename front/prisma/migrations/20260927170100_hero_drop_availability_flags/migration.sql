/*
  Warnings:

  - You are about to drop the column `availabilityOpen` on the `HomeHero` table. All the data in the column will be lost.
  - You are about to drop the column `availabilityVisible` on the `HomeHero` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HomeHero" DROP COLUMN "availabilityOpen",
DROP COLUMN "availabilityVisible";
