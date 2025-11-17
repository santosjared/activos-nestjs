import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query, Put, UseGuards } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs'
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FiltersActivoDto } from './dto/filters-activo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'
import { DisableEnamebleDto } from './dto/disbled-enable.dto';

@Controller('activos')
export class ActivosController {
  constructor(private readonly activosService: ActivosService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'activos' })
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folderPath = '';

          if (file.fieldname === 'image') {
            folderPath = './uploads/images';
          } else {
            return cb(new Error('Campo no permitido'), '');
          }

          if (!existsSync(folderPath)) {
            mkdirSync(folderPath, { recursive: true });
          }

          cb(null, folderPath);
        },

        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const extension = extname(file.originalname);
          cb(null, uniqueSuffix + extension);
        },
      }),
      limits: {
        fileSize: 12 * 1024 * 1024,
      },
    }),
  )
  async create(@Body() createActivoDto: CreateActivoDto, @UploadedFile() file: Express.Multer.File) {
    if(file && file?.filename){
      createActivoDto.imageUrl = file.filename
    }
    return await this.activosService.create(createActivoDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'activos' })
  @Get()
  async findAll(@Query() filters: FiltersActivoDto) {
    const response = await this.activosService.findAll(filters);
    return response;
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'activos' })
  @Get('category')
  async findCategory() {
    return await this.activosService.findCategory()
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'activos' })
  @Get('status')
  async findStatus(@Query() filters: FiltersActivoDto) {
    return await this.activosService.findStatus(filters)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'activos' })
  @Get('location')
  async findLocation(@Query() filters: FiltersActivoDto) {
    return await this.activosService.findLocation(filters)
  }

  

    @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'read', subject: 'activos' })
  @Get('search-code')
  async searchCode(@Query() filters: FiltersActivoDto) {
    return await this.activosService.searchCode(filters)
  }

   @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'read', subject: 'activos' })
  @Get('avalaibles')
  async findAvalaibles(@Query() filters: FiltersActivoDto) {
    const response = await this.activosService.avalaibles(filters);
    return response;
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'activos' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.activosService.findOne(id);
  }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'delete', subject: 'activos' })
  @Put('disabled')
  async disabledActivo(@Body() disbleActivo:DisableEnamebleDto){
    return await this.activosService.disableActivo(disbleActivo)
  }

     @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'delete', subject: 'activos' })
  @Put('enable/:id')
  async enableActivo(@Param('id') id:string){
    return await this.activosService.enableActivo(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'activos' })
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folderPath = '';

          if (file.fieldname === 'image') {
            folderPath = './uploads/images';
          } else {
            return cb(new Error('Campo no permitido'), '');
          }

          if (!existsSync(folderPath)) {
            mkdirSync(folderPath, { recursive: true });
          }

          cb(null, folderPath);
        },

        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const extension = extname(file.originalname);
          cb(null, uniqueSuffix + extension);
        },
      }),
      limits: {
        fileSize: 12 * 1024 * 1024,
      },
    }),
  )
  async update(@Param('id') id: string, @Body() updateActivoDto: UpdateActivoDto, @UploadedFile() file: Express.Multer.File) {

    if (file && file?.filename) {
      updateActivoDto.imageUrl = file.filename
    }
    return await this.activosService.update(id, updateActivoDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'delete', subject: 'activos' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.activosService.remove(id);
  }
}
