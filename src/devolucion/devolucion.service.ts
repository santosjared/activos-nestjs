import { Injectable } from '@nestjs/common';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { UpdateDevolucionDto } from './dto/update-devolucion.dto';
import { FiltersDevolucionDto } from './dto/filters-devolucion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Entrega, EntregaDocument } from 'src/entrega/schema/entrega.schema';
import { Model } from 'mongoose';
import { Activos, ActivosDocument } from 'src/activos/schema/activos.schema';
import { Contable, ContableDocument } from 'src/contable/schema/contable.schema';
import { SubCategory, SubCateGoryDocument } from 'src/contable/schema/sub-category.schema';
import { Status, StatusDocument } from 'src/activos/schema/status.schema';
import { locationDocument, Location } from 'src/activos/schema/location.schema';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { Grade, GradeDocument } from 'src/users/schema/grade.schema';
import { parseDate } from 'src/utils/parse-date';

@Injectable()
export class DevolucionService {
  constructor(@InjectModel(Entrega.name) private readonly entregaModel: Model<EntregaDocument>,
    @InjectModel(Activos.name) private readonly activosModel: Model<ActivosDocument>,
    @InjectModel(Contable.name) private readonly categoryModel: Model<ContableDocument>,
    @InjectModel(SubCategory.name) private readonly subModel: Model<SubCateGoryDocument>,
    @InjectModel(Status.name) private readonly statusModel: Model<StatusDocument>,
    @InjectModel(Location.name) private readonly locationModel: Model<locationDocument>,
    @InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>,
    @InjectModel(Grade.name) private readonly gradeModel: Model<GradeDocument>,
    @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCateGoryDocument>
  ) { }
  create(createDevolucionDto: CreateDevolucionDto) {
    return 'This action adds a new devolucion';
  }

  async findAll(filters: FiltersDevolucionDto) {
    const { field, skip = 0, limit = 10 } = filters
    let query: any = {}
    if (field) {
      const [
        matchgradeId,
        matchuserId,
        matchlocationId
      ] = await Promise.all([
        this.gradeModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
        this.usersModel.find({
          $or: [
            { name: { $regex: field, $options: 'i' } },
            { lastName: { $regex: field, $options: 'i' } }
          ]
        }).select('_id'),
        this.locationModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
      ])

      query.$or = [
        { code: { $regex: field, $options: 'i' } },
        { name: { $regex: field, $options: 'i' } },
        { lastName: { $regex: field, $options: 'i' } },
        { time: { $regex: field, $options: 'i' } },
        { grade: { $in: matchgradeId.map(r => r._id) } },
        { user_en: { $in: matchuserId.map(r => r._id) } },
        { location: { $in: matchlocationId.map(r => r._id) } },
      ];

      const inputDate = parseDate(field);
      if (inputDate) {
        const startOfDay = new Date(inputDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.$or.push(
          { date: { $gte: startOfDay, $lte: endOfDay } },
        );
      }
    }
    const safeLimit = Math.min(limit, 100);
    const [result, total] = await Promise.all([
      this.entregaModel.find(query).populate([
        { path: 'grade' },
        {
          path: 'user_en', select: '-password -__v',
          populate: { path: 'grade' }
        },
        { path: 'location' },
        {
          path: 'activos',
          populate: [
            { path: 'location' },
            { path: 'category' },
            { path: 'subcategory' }
          ]
        }
      ])
        .select('-createdAt -updatedAt -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      this.entregaModel.countDocuments(query)
    ])
    return { result, total };
  }

  async findEntregas(filters: FiltersDevolucionDto) {
    const { field, skip = 0, limit = 10 } = filters
    let query: any = {}
    if (field) {
      const [
        matchgradeId,
        matchuserId,
        matchlocationId
      ] = await Promise.all([
        this.gradeModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
        this.usersModel.find({
          $or: [
            { name: { $regex: field, $options: 'i' } },
            { lastName: { $regex: field, $options: 'i' } }
          ]
        }).select('_id'),
        this.locationModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
      ])

      query.$or = [
        { code: { $regex: field, $options: 'i' } },
        { name: { $regex: field, $options: 'i' } },
        { lastName: { $regex: field, $options: 'i' } },
        { time: { $regex: field, $options: 'i' } },
        { grade: { $in: matchgradeId.map(r => r._id) } },
        { user_en: { $in: matchuserId.map(r => r._id) } },
        { location: { $in: matchlocationId.map(r => r._id) } },
      ];

      const inputDate = parseDate(field);
      if (inputDate) {
        const startOfDay = new Date(inputDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.$or.push(
          { date: { $gte: startOfDay, $lte: endOfDay } },
        );
      }
    }
    const safeLimit = Math.min(limit, 100);
    const [result, total] = await Promise.all([
      this.entregaModel.find(query).populate([
        { path: 'grade' },
        {
          path: 'user_en', select: '-password -__v',
          populate: { path: 'grade' }
        },
        { path: 'location' },
        {
          path: 'activos',
          populate: [
            { path: 'location' },
            { path: 'category' },
            { path: 'subcategory' }
          ]
        }
      ])
        .select('-createdAt -updatedAt -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      this.entregaModel.countDocuments(query)
    ])
    return { result, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} devolucion`;
  }

  async findOneEntrega(id:string){
    return await this.entregaModel.findById(id)
    .populate([
        { path: 'grade' },
        {
          path: 'user_en', select: '-password -__v',
          populate: { path: 'grade' }
        },
        { path: 'location' },
        {
          path: 'activos',
          populate: [
            { path: 'location' },
            { path: 'category' },
            { path: 'subcategory' }
          ]
        }
      ])
        .select('-createdAt -updatedAt -__v')
  }

  update(id: number, updateDevolucionDto: UpdateDevolucionDto) {
    return `This action updates a #${id} devolucion`;
  }

  remove(id: number) {
    return `This action removes a #${id} devolucion`;
  }

  async options () {
    
    const [categories, subcategories, status] = await Promise.all([
      this.categoryModel.find(),
      this.subCategoryModel.find(),
      this.statusModel.find(),
    ])

    return {categories,subcategories,status}
  }
}
