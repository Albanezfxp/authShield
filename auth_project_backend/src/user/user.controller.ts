import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { loginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { Roles } from 'src/types/decoratores/role.decorator';
import { role } from '@prisma/client';
import { RolesGuard } from './guards/role.guards';
import { registerUserDto } from './dto/register-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/register')
  async register(@Body() user: registerUserDto) {
    return this.userService.register(user);
  }

  @Post('login')
  async login(
    @Body() user: loginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, access_token } = await this.userService.login(user);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { access_token };
  }

  @Post('/auth/refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    return this.authService.refresh(refreshToken);
  }

  @Roles(role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(role.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(role.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
