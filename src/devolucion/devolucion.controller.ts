import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Query, Put, UseGuards } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';
import { FiltersDevolucionDto } from './dto/filters-devolucion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'

@Controller('devolucion')
export class DevolucionController {
  constructor(private readonly devolucionService: DevolucionService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'devolucion' })
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folderPath = '';

          if (file.fieldname === 'document') {
            folderPath = './uploads/documents';
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
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  @Post()
  async create(@Body() createDevolucionDto: CreateDevolucionDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createDevolucionDto.documentUrl = file?.filename
    }
    return await this.devolucionService.create(createDevolucionDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'read', subject: 'devolucion' })
  @Get()
  async findAll(@Query() filters: FiltersDevolucionDto) {
    return await this.devolucionService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'devolucion' })
  @Get('entregas')
  async finEntregas(@Query() filters: FiltersDevolucionDto) {
    return await this.devolucionService.findEntregas(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'devolucion' })
  @Get('options')
  async options() {
    return await this.devolucionService.options();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'devolucion' })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.devolucionService.findOne(code);
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @CheckAbilities({ action: 'create', subject: 'devolucion' })
  @Get('entregas/:id')
  findOneEntrega(@Param('id') id: string) {
    return this.devolucionService.findOneEntrega(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'devolucion' })
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folderPath = '';

          if (file.fieldname === 'document') {
            folderPath = './uploads/documents';
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
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDevolucionDto: UpdateDevolucionDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      updateDevolucionDto.documentUrl = file?.filename
    }
    return await this.devolucionService.update(id, updateDevolucionDto);
  }

}
