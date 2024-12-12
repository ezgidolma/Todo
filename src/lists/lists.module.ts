import { Module } from "@nestjs/common";
import { ListController } from "./lists.controller";
import { ListService } from "./lists.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [ListController],
    providers: [ListService],
})
export class ListModule{}