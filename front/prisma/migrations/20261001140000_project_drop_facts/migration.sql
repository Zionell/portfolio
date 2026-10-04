/*
  Warnings:

  - You are about to drop the column `facts_en` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `facts_ru` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "facts_en",
DROP COLUMN "facts_ru";
