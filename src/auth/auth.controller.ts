import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefresTokenDto } from './dto/refresh-token.dto';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }
  @Post('refresh-token')
  async refresToken(@Body() tokenRefresh:RefresTokenDto){
    return await this.authService.refreshToken(tokenRefresh.token)
  }
  @Delete('logout/:id')
  async logout(@Param('id') id:string){
    return this.authService.logout(id);
  }
}
