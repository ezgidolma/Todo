import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBoardDto{
  @IsString()
  @IsOptional()
  @ApiProperty()
  title?: string;

  @ApiProperty()
  updatedAt?: Date;
}