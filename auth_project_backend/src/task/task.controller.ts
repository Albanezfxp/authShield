import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { Roles } from 'src/types/decoratores/role.decorator';
import { role } from '@prisma/client';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.taskService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() CreateTaskDto: CreateTaskDto) {
    return this.taskService.create(CreateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Body() UpdateTaskDto: UpdateTaskDto, @Param('id') id: number) {
    return this.taskService.update(UpdateTaskDto, id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.taskService.delete(id);
  }
}
