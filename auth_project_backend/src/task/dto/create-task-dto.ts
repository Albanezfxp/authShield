import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  task_name!: string;
  @IsBoolean()
  completed!: boolean;
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
