import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateWorkspaceDto {

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  title: string;

}