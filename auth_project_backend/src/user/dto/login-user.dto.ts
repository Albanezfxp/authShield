import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class loginUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
