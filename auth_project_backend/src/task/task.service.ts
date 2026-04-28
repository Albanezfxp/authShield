import { HttpException, Injectable, Req } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { situation } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findAllTaskByUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('Usuario não encontrado', 404);
    }

    const tasks = await this.prisma.task.findMany({
      where: { userId: user.id },
    });

    return tasks;
  }

  async findById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new HttpException('Task não encontrada', 404);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createTaskDto.userId },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 404);
    }

    return this.prisma.task.create({
      data: {
        task_name: createTaskDto.task_name,
        description: createTaskDto.description,
        situation: situation.TO_DO,
        userId: user.id,
      },
    });
  }

  async update(updateTaskDto: UpdateTaskDto, id: number) {
    const taskExists = await this.prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!taskExists) {
      throw new HttpException('Task não encontrada', 404);
    }

    const data: any = {};

    if (updateTaskDto.task_name !== undefined) {
      data.task_name = updateTaskDto.task_name;
    }

    if (updateTaskDto.description !== undefined) {
      data.description = updateTaskDto.description;
    }

    if (updateTaskDto.situation !== undefined) {
      data.situation = updateTaskDto.situation;
    }

    if (updateTaskDto.userId !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.userId },
      });

      if (!user) {
        throw new HttpException('Usuário não existe', 404);
      }

      data.userId = user.id;
    }

    return this.prisma.task.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: number) {
    const taskExists = await this.prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!taskExists) {
      throw new HttpException('Task não encontrada', 404);
    }

    return this.prisma.task.delete({
      where: { id: Number(id) },
    });
  }
}
