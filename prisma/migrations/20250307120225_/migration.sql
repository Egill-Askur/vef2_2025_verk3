/*
  Warnings:

  - You are about to drop the column `category` on the `Questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "category",
ADD COLUMN     "categorySlug" TEXT NOT NULL DEFAULT 'null',
ALTER COLUMN "svar1" SET DEFAULT 'null',
ALTER COLUMN "svar2" SET DEFAULT 'null',
ALTER COLUMN "svar3" SET DEFAULT 'null',
ALTER COLUMN "svar4" SET DEFAULT 'null',
ALTER COLUMN "correctAnswer" SET DEFAULT 1;
