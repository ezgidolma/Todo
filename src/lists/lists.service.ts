import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";

@Injectable()
export class ListService{
    constructor(private readonly prisma:PrismaService){}

    async createList(data: CreateListDto){
        try{
            const boardExists = await this.prisma.board.findUnique({
                where: {id:data.boardId},
            });

            if(!boardExists){
                throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
            }
            const newList = await this.prisma.list.create({
                data:{
                    title:data.title,
                    boardId: data.boardId,
                },
            });
            return newList;
        }
        catch(error){
            throw error;
        }
    }

    async updateList(id: string, data: UpdateListDto){
        const existingList = await this.prisma.list.findUnique({
            where: { id },
          });
      
          if (!existingList) {
            throw new HttpException('List not found.', HttpStatus.NOT_FOUND);
          }
      
      
          const updateData: Partial<UpdateListDto> = {
            title: data.title,
            updatedAt: new Date(),
          };
      
          return await this.prisma.list.update({
            where: { id },
            data: updateData,
          });
    }

    async getLists() {
          return await this.prisma.list.findMany({
            include:{
              tasks:true,
            },
          });
      }
    
      async deleteList(id: string) {
        const existingList = await this.prisma.list.findUnique({
          where: { id },
        });
    
        if (!existingList) {
          throw new HttpException('List not found.', HttpStatus.NOT_FOUND);
        }
    
        return await this.prisma.list.delete({
          where: { id },
        });
      }

}