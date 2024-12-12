import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateWorkspaceDto{
    @IsString()
    @IsOptional()
    @ApiProperty()
    title?: string;

    @ApiProperty()
    updatedAt?: Date;
}