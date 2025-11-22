import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreadencialesAuthDto } from './dto/credenciales-auth.dto';
import { RefresTokenDto } from './dto/refresh-token.dto';
import { Bitacora } from 'src/bitacoras/decorator/bitacora.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Bitacora('Iniciar sesion')
  @Post()
  async create(@Body() createAuthDto: CreadencialesAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('refresh-token')
  async refresToken(@Body() tokenRefresh:RefresTokenDto){
    return await this.authService.refreshToken(tokenRefresh.token)
  }

  @Bitacora('Cerrar sesion')
  @Delete('logout/:id')
  async logout(@Param('id') id:string){
    return this.authService.logout(id);
  }
}
