-- DropForeignKey
ALTER TABLE "BoardMember" DROP CONSTRAINT "BoardMember_userEmail_fkey";

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
