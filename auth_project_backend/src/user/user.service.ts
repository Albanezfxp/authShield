import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { loginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { registerUserDto } from './dto/register-user.dto';
import { compare, hash } from 'bcrypt';
import { $Enums } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async register(user: registerUserDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (userExist) {
      throw new HttpException('Email já cadastrado', 409);
    }

    if (user.password !== user.confirm_password) {
      throw new HttpException('Senhas não são iguais', 400);
    }

    const hashPassword = await hash(user.password, 10);

    const payload: CreateUserDto = {
      name: user.name,
      email: user.email,
      password: hashPassword,
      role: user.role as unknown as $Enums.role,
    };

    return await this.prisma.user.create({
      data: payload,
    });
  }

  async login(user: loginUserDto) {
    const user_bd = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!user_bd) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    const isPasswordValid = await compare(user.password, user_bd.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const payload = {
      id: user_bd.id,
      email: user_bd.email,
      role: user_bd.role,
    };

    const token = await this.authService.login(payload);

    const hashRefreshToken = await hash(token.refresh_token, 10);
    await this.prisma.user.update({
      where: { email: user_bd.email },
      data: {
        refreshToken: hashRefreshToken,
      },
    });

    return {
      user: payload,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    };
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        refreshToken: true,
        tasks: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        password: updateUserDto.password,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
