import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDto{
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @ApiProperty()
  workspaceId: string;
}