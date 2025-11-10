import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query, Put } from '@nestjs/common';
import { EntregaService } from './entrega.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FiltersEntregaDto } from './dto/filters-activo.dto';

@Controller('entregas')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) { }

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

  @Get()
  findAll(@Query() filters: FiltersEntregaDto) {
    return this.entregaService.findAll(filters);
  }

  @Get('location')
  locations() {
    return this.entregaService.locations();
  }
  @Get('grades')
  grades() {
    return this.entregaService.grades();
  }
  @Get('categories')
  categories() {
    return this.entregaService.categories();
  }
  @Get('subcategories')
  subcategories() {
    return this.entregaService.subcategories();
  }
  @Get('status')
  status() {
    return this.entregaService.status();
  }
  @Get('activos-available')
  async findAvailables(@Query() filters: FiltersEntregaDto) {
    return await this.entregaService.findAvailables(filters)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregaService.findOne(+id);
  }

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
  update(@Param('id') id: string, @Body() updateEntregaDto: UpdateEntregaDto, @UploadedFile() file: Express.Multer.File) {
     updateEntregaDto.documentUrl = file?.filename || ''
    return this.entregaService.update(id, updateEntregaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaService.remove(id);
  }
}
