import { ApiProperty } from "@nestjs/swagger";

export class UnstarBoardDto{

    @ApiProperty()
    email: string;
}