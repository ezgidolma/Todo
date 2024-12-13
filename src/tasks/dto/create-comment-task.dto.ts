import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  taskId: string;
}