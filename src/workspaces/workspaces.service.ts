import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";

@Injectable()
export class WorkspaceService {
    constructor(private readonly prisma: PrismaService) { }

    async createWorkspace(data: CreateWorkspaceDto, userId: string) {
        try {
            const newWorkspace = await this.prisma.workspace.create({
                data: {
                    title: data.title,
                    createdBy:userId
                },
            });
            return newWorkspace;
        } catch (error) {
            throw error;
        }
    }

    async updateWorkspace(id: string, data: UpdateWorkspaceDto) {
        const existingWorkspace = await this.prisma.workspace.findUnique({
            where: { id },
        });

        if (!existingWorkspace) {
            throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);
        }

        const updateData: Partial<UpdateWorkspaceDto> = {
            title: data.title,
            updatedAt: new Date(),
        };

        return await this.prisma.workspace.update({
            where: { id },
            data: updateData,
        });
    }

    async getWorkspacesByUserId(userId: string) {
        return await this.prisma.workspace.findMany({
          where: { createdBy: userId }, // createdBy alanı userId ile eşleşen workspace'leri bul
          include: { boards: true },    // İlişkili board'ları dahil et
        });
      }
      
    async deleteWorkspace(id: string) {
        const existingWorkspace = await this.prisma.workspace.findUnique({
            where: { id },
        });

        if (!existingWorkspace) {
            throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
        }

        return await this.prisma.workspace.delete({
            where: { id },
        });
    }
}