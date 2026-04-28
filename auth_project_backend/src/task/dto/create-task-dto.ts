import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum situation {
  TO_DO,
  IN_PROGRESS,
  DONE,
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  task_name!: string;
  @IsNotEmpty()
  @IsOptional()
  situation!: situation;
  @IsString()
  description!: string;
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
