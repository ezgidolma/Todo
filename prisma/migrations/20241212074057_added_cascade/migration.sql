-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_listId_fkey";

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
