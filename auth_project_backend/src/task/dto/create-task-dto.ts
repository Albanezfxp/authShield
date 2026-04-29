import { Situation } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  task_name!: string;
  @IsNotEmpty()
  @IsOptional()
  situation!: Situation;
  @IsString()
  description!: string;
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
