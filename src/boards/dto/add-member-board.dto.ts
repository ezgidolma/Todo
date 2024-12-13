import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AddMemberToBoardDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    boardId: string;
}