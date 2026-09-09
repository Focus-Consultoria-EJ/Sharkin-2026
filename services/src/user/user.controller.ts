import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dtos';
import { User } from './user';

@Controller('user')
export class UserController {
  constructor(private repo: User) {}

  @Get()
  async findAllUsers() {
    return this.repo.findAllUsers();
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return this.repo.findUser(id);
  }

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return this.repo.createUser(data);
  }

  @Patch(':id')
  async desactivateUser(@Param('id') id: string) {
    return this.repo.desactivateUser(id);
  }
}
