import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ActivosService } from './activos.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs'
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FiltrosActivosDto } from './dto/filters-activo.dto';

@Controller('activos')
export class ActivosController {
  constructor(private readonly activosService: ActivosService) { }


  //   const fileFilter = (req, file, cb) => {
  //   if (file.mimetype.startsWith('image/')) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Solo se permiten archivos de imagen'), false);
  //   }
  // };

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
      // fileFilter,
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async create(@Body() createActivoDto: CreateActivoDto, @UploadedFile() file: Express.Multer.File) {
    const imageUrl = file.filename || ''
    return await this.activosService.create({ ...createActivoDto, imageUrl });
  }

  @Get()
  async findAll(@Query() filters: FiltrosActivosDto) {
    const response = await this.activosService.findAll(filters);
    return response;
  }

  @Get('category')
  async findCategory(){
    return await this.activosService.findCategory()
  }

  @Get('status')
  async findStatus(){
    return await this.activosService.findStatus()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivoDto: UpdateActivoDto) {
    return this.activosService.update(+id, updateActivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activosService.remove(+id);
  }
}
