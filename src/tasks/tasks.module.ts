import { Module } from "@nestjs/common";
import { TaskController } from "./tasks.controller";
import { TaskService } from "./tasks.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "src/jwt/jwt-strategy";
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [MulterModule.register({
        dest: './uploads', 
      }),PrismaModule, AuthModule],
    controllers: [TaskController],
    providers: [TaskService, JwtService, JwtStrategy],
})
export class TaskModule { }