import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }
  async findById(id: number) {
    return this.prisma.task.findFirst({
      where: { id },
    });
  }
  async create(CreateTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: CreateTaskDto,
    });
  }
  async update(updateTaskDto: UpdateTaskDto, id: number) {
    return this.prisma.task.update({
      where: { id: id },
      data: updateTaskDto,
    });
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
