import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
export class registerUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  confirm_password!: string;
  @IsNotEmpty()
  @IsString()
  name!: string;
  @IsEnum(Role)
  role!: Role;
}
