-- CreateEnum
CREATE TYPE "ProfileRelationship" AS ENUM ('SELF', 'PARENT', 'CHILD');

-- CreateEnum
CREATE TYPE "BiologicalSex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "users"
RENAME COLUMN "createdAt" TO "created_at";

-- AlterTable
ALTER TABLE "users"
RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE "users"
ADD COLUMN "auth_user_id" UUID,
ADD COLUMN "email" TEXT,
ADD COLUMN "expo_push_token" TEXT;

-- Backfill auth_user_id for existing rows so the new NOT NULL constraint can be applied safely.
UPDATE "users"
SET "auth_user_id" = "id"
WHERE "auth_user_id" IS NULL;

-- AlterTable
ALTER TABLE "users"
ALTER COLUMN "auth_user_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_user_id_key" ON "users"("auth_user_id");

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" "ProfileRelationship" NOT NULL,
    "birth_date" DATE NOT NULL,
    "biological_sex" "BiologicalSex",
    "health_info" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkup_types" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkup_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_checkups" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "checkup_type_id" UUID NOT NULL,
    "frequency_days" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_checkups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkup_records" (
    "id" UUID NOT NULL,
    "profile_checkup_id" UUID NOT NULL,
    "performed_at" DATE NOT NULL,
    "comments" TEXT,
    "doctor_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkup_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_profiles_user_id_profile_id_key" ON "users_profiles"("user_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "checkup_types_slug_key" ON "checkup_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "profile_checkups_profile_id_checkup_type_id_key" ON "profile_checkups"("profile_id", "checkup_type_id");

-- AddForeignKey
ALTER TABLE "users_profiles"
ADD CONSTRAINT "users_profiles_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_profiles"
ADD CONSTRAINT "users_profiles_profile_id_fkey"
FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_checkups"
ADD CONSTRAINT "profile_checkups_profile_id_fkey"
FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_checkups"
ADD CONSTRAINT "profile_checkups_checkup_type_id_fkey"
FOREIGN KEY ("checkup_type_id") REFERENCES "checkup_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkup_records"
ADD CONSTRAINT "checkup_records_profile_checkup_id_fkey"
FOREIGN KEY ("profile_checkup_id") REFERENCES "profile_checkups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
