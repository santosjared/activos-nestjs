import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Activos, ActivosDocument } from './schema/activos.schema';
import { Model } from 'mongoose';
import { FiltrosActivosDto } from './dto/filters-activo.dto';
import { Category, CategoryDocument } from './schema/category.schema';
import { parseDate } from 'src/utils/parse-date';
import { Status, StatusDocument } from './schema/status.schema';
import { Location, locationDocument } from './schema/location.schema';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { Entrega, EntregaDocument } from 'src/entrega/schema/entrega.schema';
import { Contable, ContableDocument } from 'src/contable/schema/contable.schema';
import { SubCategory, SubCateGoryDocument } from 'src/contable/schema/sub-category.schema';
import path from 'path';

@Injectable()
export class ActivosService {
  constructor(
    @InjectModel(Activos.name) private readonly activosModel: Model<ActivosDocument>,
    @InjectModel(Contable.name) private readonly categoryModel: Model<ContableDocument>,
    @InjectModel(SubCategory.name) private readonly subModel: Model<SubCateGoryDocument>,
    @InjectModel(Status.name) private readonly statusModel: Model<StatusDocument>,
    @InjectModel(Location.name) private readonly locationModel: Model<locationDocument>,
    @InjectModel(Users.name) private readonly UsersModel: Model<UsersDocument>,
    @InjectModel(Entrega.name) private readonly entregaModel: Model<EntregaDocument>,
  ) { }
  async create(createActivoDto: CreateActivoDto) {
    const data = { ...createActivoDto };

    if (data.otherStatus) {
      const { _id } = await this.statusModel.create({ name: data.otherStatus });
      data.status = _id.toString();
    }

    if (data.otherLocation) {
      const { _id } = await this.locationModel.create({ name: data.otherLocation });
      data.location = _id.toString()
    }

    return await this.activosModel.create(data);
  }

  async findAll(filters: FiltrosActivosDto) {
  const { field = '', skip = 0, limit = 10 } = filters;
  let query: any = {};

  if (field) {
    const [
      matchedCategory,
      matchedStatus,
      matchedLocation,
      matchedSub,
      matchedResponsable
    ] = await Promise.all([
      this.categoryModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
      this.statusModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
      this.locationModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
      this.subModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
      this.UsersModel.find({
        $or: [
          { name: { $regex: field, $options: 'i' } },
          { lastName: { $regex: field, $options: 'i' } }
        ]
      }).select('_id')
    ]);

    query.$or = [
      { code: { $regex: field, $options: 'i' } },
      { name: { $regex: field, $options: 'i' } },
      { description: { $regex: field, $options: 'i' } },
      { location: { $in: matchedLocation.map(r => r._id) } },
      { status: { $in: matchedStatus.map(r => r._id) } },
      { category: { $in: matchedCategory.map(r => r._id) } },
      { subcategory: { $in: matchedSub.map(r => r._id) } },
      { responsable: { $in: matchedResponsable.map(r => r._id) } }
    ];
    const inputDate = parseDate(field);
    if (inputDate) {
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.$or.push(
        { date_a: { $gte: startOfDay, $lte: endOfDay } },
        { date_e: { $gte: startOfDay, $lte: endOfDay } }
      );
    }
    const numValue = Number(field);
    if (!isNaN(numValue)) {
      query.$or.push({ price_a: numValue });
    }
  }

  const [result, total] = await Promise.all([
    this.activosModel
      .find(query)
      .populate([
        { path: 'status', select: '-__v' },
        { path: 'location', select: '-__v' },
        {
          path: 'responsable',
          select: '-__v -password',
          populate: { path: 'grade', select: '-__v' }
        },
        { path: 'category', 
          select: '-__v', 
          populate: {path:'subcategory', select:'-__v'}
        },
        { path: 'subcategory', select: '-__v' }
      ])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    this.activosModel.countDocuments(query)
  ]);

  return { result, total };
}


  async findAvailables(filters: FiltrosActivosDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const matchedCategory = await this.categoryModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
    const matchedStatus = await this.statusModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
    const matchedLocation = await this.locationModel.find({ name: { $regex: field, $options: 'i' } }).select('_id');
    const matchedResponsable = await this.UsersModel.find({
      $or: [
        { grade: { $regex: field, $options: 'i' } },
        { name: { $regex: field, $options: 'i' } },
        { lastName: { $regex: field, $options: 'i' } }
      ]
    }).select('_id');

    const entregadosIds = await this.entregaModel.distinct('activos');

    const query: any = {
      _id: { $nin: entregadosIds },
      $or: [
        { code: { $regex: field, $options: 'i' } },
        { name: { $regex: field, $options: 'i' } },
        { location: { $in: matchedLocation.map(r => r._id) } },
        { status: { $in: matchedStatus.map(r => r._id) } },
        { category: { $in: matchedCategory.map(r => r._id) } },
        { responsable: { $in: matchedResponsable.map(r => r._id) } }
      ]
    };

    const inputDate = parseDate(field);
    if (inputDate) {
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.$or.push(
        { date_a: { $gte: startOfDay, $lte: endOfDay } },
        { date_e: { $gte: startOfDay, $lte: endOfDay } }
      );
    }

    const isNumeric = !isNaN(Number(field));
    if (isNumeric) {
      const numValue = Number(field);
      query.$or.push({ price_a: numValue });
    }

    const result = await this.activosModel
      .find(query)
      .populate([
        { path: 'status' },
        { path: 'location' },
        {
          path: 'responsable',
          populate: {
            path: 'grade'
          }
        },
      ])
      .skip(skip)
      .limit(limit);

    const total = await this.activosModel.countDocuments(query);

    return { result, total };
  }

  async findCategory() {
    return await this.categoryModel.find()
  }

  async findStatus() {
    return await this.statusModel.find()
  }

  async findLocation() {
    return await this.locationModel.find()
  }


  findOne(id: number) {
    return `This action returns a #${id} activo`;
  }

  async update(id: string, updateActivoDto: UpdateActivoDto) {
    const data = { ...updateActivoDto };

    if (data.otherStatus?.trim()) {
      const { _id } = await this.statusModel.create({ name: data.otherStatus.trim() });
      data.status = _id.toString();
    }

    const updated = await this.activosModel.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      throw new NotFoundException(`Activo con ID ${id} no encontrado`);
    }

    return updated;
  }


  async remove(id: string) {
    return await this.activosModel.findByIdAndDelete(id);
  }
}
