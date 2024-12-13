import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { WorkspaceService } from "./workspaces.service";
import { WorkspaceController } from "./workspaces.controller";
import { BoardModule } from "src/boards/boards.module";
import { BoardService } from "src/boards/boards.service";

@Module({
    imports: [PrismaModule, BoardModule],
    controllers: [WorkspaceController],
    providers: [WorkspaceService, BoardService],
})
export class WorkspaceModule { }