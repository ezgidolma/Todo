import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { WorkspaceService } from "./workspaces.service";
import { WorkspaceController } from "./workspaces.controller";

@Module({
    imports: [PrismaModule],
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
})
export class WorkspaceModule{}