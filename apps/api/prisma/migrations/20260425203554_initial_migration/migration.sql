-- CreateEnum
CREATE TYPE "BiologicalSex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "CheckupStatus" AS ENUM ('UPCOMING', 'OVERDUE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ORDEN_MEDICA', 'RESULTADO', 'RECETA');

-- CreateEnum
CREATE TYPE "DevicePlatform" AS ENUM ('ios', 'android', 'web');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "externalAuthId" TEXT NOT NULL,
    "authProvider" TEXT NOT NULL,
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "familyGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'VIEWER',
    "permissions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceProvider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "familyGroupId" TEXT,
    "insuranceProviderId" TEXT,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "biologicalSex" "BiologicalSex" NOT NULL,
    "riskFactors" JSONB NOT NULL DEFAULT '{}',
    "isSelf" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckupType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "baseFrequencyDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckupType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalProtocol" (
    "id" TEXT NOT NULL,
    "checkupTypeId" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER,
    "sex" "BiologicalSex",
    "suggestedFrequencyDays" INTEGER NOT NULL,
    "riskFactorKey" TEXT,
    "countryCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalProtocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCheckup" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "checkupTypeId" TEXT NOT NULL,
    "sourceProtocolId" TEXT,
    "lastPerformed" TIMESTAMP(3),
    "customFrequencyDays" INTEGER,
    "status" "CheckupStatus" NOT NULL DEFAULT 'UPCOMING',
    "nextDueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCheckup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalDocument" (
    "id" TEXT NOT NULL,
    "checkupId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileUrl" TEXT,
    "ocrData" JSONB,
    "type" "DocumentType" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pushToken" TEXT NOT NULL,
    "platform" "DevicePlatform" NOT NULL,
    "timezone" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalAuthId_key" ON "User"("externalAuthId");

-- CreateIndex
CREATE INDEX "GroupMember_userId_idx" ON "GroupMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_familyGroupId_userId_key" ON "GroupMember"("familyGroupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceProvider_slug_key" ON "InsuranceProvider"("slug");

-- CreateIndex
CREATE INDEX "Profile_ownerId_idx" ON "Profile"("ownerId");

-- CreateIndex
CREATE INDEX "Profile_familyGroupId_idx" ON "Profile"("familyGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckupType_slug_key" ON "CheckupType"("slug");

-- CreateIndex
CREATE INDEX "MedicalProtocol_checkupTypeId_minAge_maxAge_idx" ON "MedicalProtocol"("checkupTypeId", "minAge", "maxAge");

-- CreateIndex
CREATE INDEX "UserCheckup_profileId_status_nextDueAt_idx" ON "UserCheckup"("profileId", "status", "nextDueAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserCheckup_profileId_checkupTypeId_key" ON "UserCheckup"("profileId", "checkupTypeId");

-- CreateIndex
CREATE INDEX "MedicalDocument_checkupId_idx" ON "MedicalDocument"("checkupId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_pushToken_key" ON "DeviceToken"("pushToken");

-- CreateIndex
CREATE INDEX "DeviceToken_userId_idx" ON "DeviceToken"("userId");

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_familyGroupId_fkey" FOREIGN KEY ("familyGroupId") REFERENCES "FamilyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_familyGroupId_fkey" FOREIGN KEY ("familyGroupId") REFERENCES "FamilyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_insuranceProviderId_fkey" FOREIGN KEY ("insuranceProviderId") REFERENCES "InsuranceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalProtocol" ADD CONSTRAINT "MedicalProtocol_checkupTypeId_fkey" FOREIGN KEY ("checkupTypeId") REFERENCES "CheckupType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCheckup" ADD CONSTRAINT "UserCheckup_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCheckup" ADD CONSTRAINT "UserCheckup_checkupTypeId_fkey" FOREIGN KEY ("checkupTypeId") REFERENCES "CheckupType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCheckup" ADD CONSTRAINT "UserCheckup_sourceProtocolId_fkey" FOREIGN KEY ("sourceProtocolId") REFERENCES "MedicalProtocol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalDocument" ADD CONSTRAINT "MedicalDocument_checkupId_fkey" FOREIGN KEY ("checkupId") REFERENCES "UserCheckup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
