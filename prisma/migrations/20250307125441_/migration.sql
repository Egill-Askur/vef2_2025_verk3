/*
  Warnings:

  - A unique constraint covering the columns `[questionSlug]` on the table `Questions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Questions" ALTER COLUMN "questionSlug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Questions_questionSlug_key" ON "Questions"("questionSlug");
