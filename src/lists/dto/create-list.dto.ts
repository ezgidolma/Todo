import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateListDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;  

    @IsUUID()
    @ApiProperty()
    boardId: string;

}