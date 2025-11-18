import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query, Put, UseGuards } from '@nestjs/common';
import { EntregaService } from './entrega.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FiltersEntregaDto } from './dto/filters-activo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator'

@Controller('entregas')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) { }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'create', subject: 'entrega' })
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
  async create(@Body() createEntregaDto: CreateEntregaDto, @UploadedFile() file: Express.Multer.File) {
    createEntregaDto.documentUrl = file?.filename || ''
    return this.entregaService.create(createEntregaDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  findAll(@Query() filters: FiltersEntregaDto) {
    return this.entregaService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('location')
  locations() {
    return this.entregaService.locations();
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('grades')
  grades() {
    return this.entregaService.grades();
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('categories')
  categories() {
    return this.entregaService.categories();
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('subcategories')
  subcategories() {
    return this.entregaService.subcategories();
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('status')
  status() {
    return this.entregaService.status();
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('activos-available')
  async findAvailables(@Query() filters: FiltersEntregaDto) {
    return await this.entregaService.findAvailables(filters)
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('code')
  async getCode() {
    return await this.entregaService.generateUniqueCode()
  }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':code')
  async findOne(@Param('code') code: string) {
    return await this.entregaService.findOne(code);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'update', subject: 'entrega' })
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateEntregaDto: UpdateEntregaDto, @UploadedFile() file: Express.Multer.File) {
    updateEntregaDto.documentUrl = file?.filename || ''
    return this.entregaService.update(id, updateEntregaDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckAbilities({ action: 'delete', subject: 'entrega' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaService.remove(id);
  }
}
