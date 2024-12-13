import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateListDto {

  @IsOptional()
  @IsString()
  @ApiProperty()
  title?: string;

  @ApiProperty()
  updatedAt?: Date;
}