import { Injectable } from '@nestjs/common';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Activos, ActivosDocument } from './schema/activos.schema';
import { Model } from 'mongoose';
import { FiltrosActivosDto } from './dto/filters-activo.dto';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class ActivosService {
  constructor(@InjectModel(Activos.name) private readonly activosModel:Model<ActivosDocument>,
  @InjectModel(Category.name) private readonly categoryModel:Model<CategoryDocument>
){}
  async create(createActivoDto: CreateActivoDto) {
    if(createActivoDto.otherCategory){
      const newCategory = await this.categoryModel.create({name:createActivoDto.otherCategory})
      return await this.activosModel.create({...createActivoDto, category:newCategory._id})
    }
    return await this.activosModel.create(createActivoDto);
  }

async findAll(filters:FiltrosActivosDto ) {
  const { field = '', skip = 0, limit = 10 } = filters;

  const query: any = {
    $or: [
      { code: { $regex: field, $options: 'i' } },
      { name: { $regex: field, $options: 'i' } },
      { location: { $regex: field, $options: 'i' } },
      { lote: { $regex: field, $options: 'i' } },
      { date_a: { $regex: field, $options: 'i' } },
      { date_e: { $regex: field, $options: 'i' } },
      { status: { $regex: field, $options: 'i' } },
    ],
  };

  const isNumeric = !isNaN(Number(field));

  if (isNumeric) {
    const numValue = Number(field);
    query.$or.push(
      { price_a: numValue },
      { cantidad: numValue },
    );
  }
  const result = await this.activosModel.find(query).populate('category').skip(skip).limit(limit);
  const total = await this.activosModel.countDocuments(query);

  return { result, total };
}

async findCategory(){
  return await this.categoryModel.find()
}


  findOne(id: number) {
    return `This action returns a #${id} activo`;
  }

  update(id: number, updateActivoDto: UpdateActivoDto) {
    return `This action updates a #${id} activo`;
  }

  remove(id: number) {
    return `This action removes a #${id} activo`;
  }
}
