import { Module } from "@nestjs/common";
import { BoardService } from "./boards.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { BoardController } from "./boards.controller";
import { JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "src/jwt/jwt-strategy";

@Module({
    imports: [PrismaModule],
    controllers: [BoardController],
    providers: [BoardService, JwtService, JwtStrategy],
})
export class BoardModule { }