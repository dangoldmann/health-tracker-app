/*
  Warnings:

  - Made the column `biological_sex` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "BiologicalSex" ADD VALUE 'PREFER_NOT_TO_SAY';

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "biological_sex" SET NOT NULL;
