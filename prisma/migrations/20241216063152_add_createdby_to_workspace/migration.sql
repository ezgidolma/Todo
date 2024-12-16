-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'unknown';

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
