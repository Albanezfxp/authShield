import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/byUser/:id')
  async findAllTasksByUser(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findAllTaskByUser(id);
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
  @Put(':id')
  update(@Body() UpdateTaskDto: UpdateTaskDto, @Param('id') id: number) {
    return this.taskService.update(UpdateTaskDto, id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.taskService.delete(id);
  }
}
