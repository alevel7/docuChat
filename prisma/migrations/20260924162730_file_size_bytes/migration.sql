/*
  Warnings:

  - Added the required column `fileSizeBytes` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" TEXT,
ADD COLUMN     "fileSizeBytes" INTEGER NOT NULL;
