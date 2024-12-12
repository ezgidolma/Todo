import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    @ApiProperty()
    title?: string; 

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

}