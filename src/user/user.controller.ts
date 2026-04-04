import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body() userDto: CreateUserDto) {
    return this.userService.create(userDto);
  }
}
