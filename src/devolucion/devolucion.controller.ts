import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query, Put } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';
import { FiltersDevolucionDto } from './dto/filters-devolucion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('devolucion')
export class DevolucionController {
  constructor(private readonly devolucionService: DevolucionService) { }

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
    createDevolucionDto.documentUrl = file?.filename || ''
    return await this.devolucionService.create(createDevolucionDto);
  }

  @Get()
  async findAll(@Query() filters: FiltersDevolucionDto) {
    return await this.devolucionService.findAll(filters);
  }

  @Get('entregas')
  async finEntregas(@Query() filters: FiltersDevolucionDto) {
    return await this.devolucionService.findEntregas(filters);
  }
  @Get('options')
  async options() {
    return await this.devolucionService.options();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devolucionService.findOne(+id);
  }

  @Get('entregas/:id')
  findOneEntrega(@Param('id') id: string) {
    return this.devolucionService.findOneEntrega(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDevolucionDto: UpdateDevolucionDto) {
    return this.devolucionService.update(+id, updateDevolucionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devolucionService.remove(+id);
  }
}
