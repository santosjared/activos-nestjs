import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FiltersUsersDto } from './dto/filters-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'
import { UserDto } from './dto/dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'users' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

   @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'entrega' })
  @Post('create')
  createUser(@Body() createUserDto: UserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'users' })
  @Get()
  async findAll(@Query() filters: FiltersUsersDto) {
    return await this.usersService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'activos' })
  @Get('all-users')
  async allUserActive(@Query() filters: FiltersUsersDto) {
    return await this.usersService.allUsersActive(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'users' })
  @Get('grades')
  async grades(@Query() filters: FiltersUsersDto) {
    return await this.usersService.grades(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'users' })
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string) {
    return await this.usersService.checkEmail(email)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'users' })
  @Get('check-ci/:ci')
  async checkCi(@Param('ci') ci: string) {
    return await this.usersService.checkCi(ci)
  }
  
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'entrega' })
  @Get('allUsers')
  async allUsers(@Query() filters:FiltersUsersDto){
    return await this.usersService.allUsers(filters)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'entrega' })
  @Get(':id')
  async findOne(@Param('id') id:string){
    return await this.usersService.findOne(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'users' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'dow', subject: 'users' })
  @Delete('dow/:id')
  dow(@Param('id') id: string) {
    return this.usersService.dow(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'up', subject: 'users' })
  @Delete('up/:id')
  up(@Param('id') id: string) {
    return this.usersService.up(id);
  }
}
