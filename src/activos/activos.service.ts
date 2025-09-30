import { Injectable } from '@nestjs/common';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Activos, ActivosDocument } from './schema/activos.schema';
import { Model } from 'mongoose';
import { FiltrosActivosDto } from './dto/filters-activo.dto';
import { Category, CategoryDocument } from './schema/category.schema';
import { parseDate } from 'src/utils/parse-date';
import { Status, StatusDocument } from './schema/status.schema';

@Injectable()
export class ActivosService {
  constructor(@InjectModel(Activos.name) private readonly activosModel: Model<ActivosDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Status.name) private readonly statusModel: Model<StatusDocument>
  ) { }
  async create(createActivoDto: CreateActivoDto) {
    const data = { ...createActivoDto };

    if (data.otherCategory) {
      const { _id } = await this.categoryModel.create({ name: data.otherCategory });
      data.category = _id.toString();
    }

    if (data.otherStatus) {
      const { _id } = await this.statusModel.create({ name: data.otherStatus });
      data.status = _id.toString();
    }

    return this.activosModel.create(data);
  }


  async findAll(filters: FiltrosActivosDto) {
    const { field = '', skip = 0, limit = 10 } = filters;
    const matchedCategory = await this.categoryModel.find({ name: { $regex: field, $options: 'i' } }).select('_id')
    const matchedStatus = await this.statusModel.find({ name: { $regex: field, $options: 'i' } }).select('_id')
    const query: any = {
      $or: [
        { code: { $regex: field, $options: 'i' } },
        { name: { $regex: field, $options: 'i' } },
        { location: { $regex: field, $options: 'i' } },
        { status: { $in: matchedStatus.map(r => r._id) }},
        { category: { $in: matchedCategory.map(r => r._id) } }
      ],
    };

    const inputDate = parseDate(field);

    if (inputDate) {
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.$or.push(
        { date_a: { $gte: startOfDay, $lte: endOfDay } },
        { date_e: { $gte: startOfDay, $lte: endOfDay } },
      );
    }


    const isNumeric = !isNaN(Number(field));

    if (isNumeric) {
      const numValue = Number(field);
      query.$or.push(
        { price_a: numValue },
        { cantidad: numValue },
      );
    }
    const result = await this.activosModel.find(query).populate('category').populate('status').skip(skip).limit(limit);
    const total = await this.activosModel.countDocuments(query);

    return { result, total };
  }

  async findCategory() {
    return await this.categoryModel.find()
  }

  async findStatus() {
    return await this.statusModel.find()
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
