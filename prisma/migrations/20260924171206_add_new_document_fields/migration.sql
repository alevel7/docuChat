/*
  Warnings:

  - Added the required column `filename` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "error" TEXT,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
