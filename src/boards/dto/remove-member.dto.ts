import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RemoveMemberToBoardDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    boardId: string;
}