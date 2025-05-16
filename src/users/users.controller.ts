import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {  ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  async findAll(@Query() filters:any) {
    return await this.usersService.findAll(filters);
  }

  @Get('genders')
  async findAllGender(){
    return await this.usersService.findAllGender()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('dow/:id')
  dow(@Param('id') id: string) {
    return this.usersService.dow(id);
  }
  @Delete('up/:id')
  up(@Param('id') id: string) {
    return this.usersService.up(id);
  }
}
