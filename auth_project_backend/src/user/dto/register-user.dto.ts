import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { role } from 'src/types/enums/role.enum';

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
  @IsEnum(role)
  role!: role;
}
