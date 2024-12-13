import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    @ApiProperty()
    status?: TaskStatus;

    @IsOptional()
    @IsDateString()
    @ApiProperty()
    dueDate?: string;

    @IsUUID()
    @ApiProperty()
    listId: string;

    @IsUUID()
    @ApiProperty()
    boardId: string;

}