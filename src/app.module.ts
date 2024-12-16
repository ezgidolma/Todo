import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './boards/boards.module';
import { config } from './config/config';
import { ListModule } from './lists/lists.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './tasks/tasks.module';
import { WorkspaceModule } from './workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TaskModule,
    PrismaModule,
    AuthModule,
    ListModule,
    BoardModule,
    WorkspaceModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
