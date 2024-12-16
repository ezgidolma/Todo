import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment-task.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class TaskService {
    private readonly supabase:SupabaseClient; 

    constructor(private readonly prisma: PrismaService) {
      this.supabase = new SupabaseClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
  }

    async createTask(data: CreateTaskDto) {
        try {

            const listExists = await this.prisma.list.findUnique({
                where: { id: data.listId },
            });

            if (!listExists) {
                throw new HttpException('List not found.', HttpStatus.NOT_FOUND);
            }

            const boardExists = await this.prisma.board.findUnique({
                where: { id: data.boardId },
            });

            if (!boardExists) {
                throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
            }

            const newTask = await this.prisma.task.create({
                data: {
                    title: data.title,
                    description: data.description,
                    status: data.status || 'TODO',
                    dueDate: data.dueDate,
                    listId: data.listId,
                    boardId: data.boardId,
                },
            });

            return newTask;
        } catch (error) {
            throw error;
        }
    }

    async updateTask(id: string, data: UpdateTaskDto) {
        const existingTask = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask) {
            throw new HttpException('Task not found.', HttpStatus.NOT_FOUND);
        }

        const updateData: Partial<UpdateTaskDto> = Object.assign(
            {},
            data.title !== undefined && { title: data.title },
            data.description !== undefined && { description: data.description },
            data.status !== undefined && { status: data.status },
            data.dueDate !== undefined && { dueDate: data.dueDate },

            { updatedAt: new Date() },
        );

        return await this.prisma.task.update({
            where: { id },
            data: updateData,
        });
    }

    async getTasks() {
        return await this.prisma.task.findMany();
    }

    async deleteTask(id: string) {
        const existingTask = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask) {
            throw new HttpException('Task not found.', HttpStatus.NOT_FOUND);
        }

        return await this.prisma.task.delete({
            where: { id },
        });
    }

    async addCommentToTask(userEmail: string, createCommentDto: CreateCommentDto) {
        const { taskId, content } = createCommentDto;

        const taskExists = await this.prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!taskExists) {
            throw new Error('Task not found');
        }

        return await this.prisma.comment.create({
            data: {
                content,
                userEmail,
                taskId,
            },
        });
    }

    async getCommentsByTaskId(taskId: string) {
        return await this.prisma.comment.findMany({
            where: { taskId },
            include: { task: true },
        });
    }

    async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const fileName = `${Date.now()}_${file.originalname}`;
   
    const { data, error } = await this.supabase
      .storage
      .from('images')  
      .upload(fileName, file.buffer, {
        cacheControl: '3600', 
        upsert: false, 
      });

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
    return {
      fileName: data?.path,
      url: `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`,  
    };
  }
}
