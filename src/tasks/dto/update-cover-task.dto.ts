import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UpdateCoverDto {
    
  @IsString()
  @IsUrl()
  @ApiProperty()
  coverImageUrl: string;

}
