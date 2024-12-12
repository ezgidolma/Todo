import { Module } from "@nestjs/common";
import { BoardService } from "./boards.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { BoardController } from "./boards.controller";

@Module({
    imports: [PrismaModule],
    controllers: [BoardController],
    providers: [BoardService],
})
export class BoardModule {}