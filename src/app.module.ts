import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TaskModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ListModule } from './lists/lists.module';
import { BoardModule } from './boards/boards.module';
import { WorkspaceModule } from './workspaces/workspaces.module';

@Module({
  imports: [TaskModule, PrismaModule, AuthModule, ListModule, BoardModule, WorkspaceModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
