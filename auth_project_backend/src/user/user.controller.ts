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
  UseGuards,
} from '@nestjs/common';
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/register')
  register(@Body() user: registerUserDto) {
    return this.userService.register(user);
  }

  @Post('/login')
  login(@Body() user: loginUserDto) {
    return this.userService.login(user);
  }

  @Post('/auth/refresh')
  refresh(@Body() token) {
    return this.authService.refresh(token);
  }

  @Roles(role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
