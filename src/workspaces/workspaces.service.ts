import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";

@Injectable()
export class WorkspaceService {
    constructor(private readonly prisma: PrismaService) { }

    async createWorkspace(data: CreateWorkspaceDto) {
        try {
            const newWorkspace = await this.prisma.workspace.create({
                data: {
                    title: data.title,
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

    async getWorkspaces() {
        return await this.prisma.workspace.findMany();

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