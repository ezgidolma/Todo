-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_createdBy_fkey";

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "createdBy" DROP NOT NULL,
ALTER COLUMN "createdBy" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
