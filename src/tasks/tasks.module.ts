import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/jwt/jwt-strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { storage, TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';

@Module({
  imports: [
    MulterModule.register({
      storage: storage,
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, JwtService, JwtStrategy],
})
export class TaskModule {}
