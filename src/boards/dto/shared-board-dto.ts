import { IsEmail, IsNotEmpty } from 'class-validator';

export class ShareBoardDto {
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;
}
