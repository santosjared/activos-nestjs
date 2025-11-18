import { Injectable, NotFoundException } from '@nestjs/common';
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
import { Devolucion, DevolucionDocument } from './schema/devolucion.schema';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

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
    @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCateGoryDocument>,
    @InjectModel(Devolucion.name) private readonly devolucionModel:Model<DevolucionDocument>
  ) { }
  async create(createDevolucionDto: CreateDevolucionDto) {
    const activosIds = await Promise.all(
          createDevolucionDto.activos.map(async (id) => {
            const updatedActivo = await this.activosModel.findByIdAndUpdate(
              id,
              { disponibilidad: true },
              { new: true }
            );
            return updatedActivo?._id;
          })
        );
        const devolucion = await this.devolucionModel.create({...createDevolucionDto, activos: activosIds.filter(Boolean),
        });
    return devolucion;
  }

  async findAll(filters: FiltersDevolucionDto) {
       const { field = '', skip = 0, limit = 10 } = filters

    const matchConditions: any[] = [];

    const words = field?.trim().split(' ').filter(w => w !== '');

    if (words.length > 0) {
      const regexFilters = words.map(word => {
        const regex = new RegExp(word, 'i');
        return {
          $or: [
            { code: regex },
            { time: regex },
            { 'user_rec.grade.name': regex },
            { 'user_rec.name': regex },
            { 'user_rec.lastName': regex },
            { 'user_dev.grade.name': regex },
            { 'user_dev.name': regex },
            { 'user_dev.lastName': regex },
          ]
        }
      });
      if (regexFilters.length > 0) {
        matchConditions.push({ $and: regexFilters });
      }
    }
    const inputDate = parseDate(field);
    if (inputDate) {
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);

      matchConditions.push({
        date_a: { $gte: startOfDay, $lte: endOfDay }
      });
    }

    const pipeline: any[] = [
      { $lookup: { from: "users", localField: "user_rec", foreignField: "_id", as: "user_rec" } },
      { $lookup: { from: "users", localField: "user_dev", foreignField: "_id", as: "user_dev" } },
      { $unwind: { path: "$user_rec", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$user_dev", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "grades",
          localField: "user_rec.grade",
          foreignField: "_id",
          as: "user_rec.grade"
        }
      },
      { $unwind: { path: "$user_rec.grade", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "grades",
          localField: "user_dev.grade",
          foreignField: "_id",
          as: "user_dev.grade"
        }
      },
      { $unwind: { path: "$user_dev.grade", preserveNullAndEmptyArrays: true } },

      ...(matchConditions.length > 0 ? [{ $match: { $or: matchConditions } }] : [])
    ];


    const countPipeline = [...pipeline, { $count: "total" }]
    const dataPipeline = [...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Math.min(limit, 100) },
    {
      $project: {
        user_dev: {
          _id: 1,
          name: 1,
          lastName: 1,
          grade: {
            _id: 1,
            name: 1
          }
        },
        user_rec: {
          _id: 1,
          name: 1,
          lastName: 1,
          grade: 1
        },
        _id: 1,
        date: 1,
        code: 1,
        time: 1,
        documentUrl: 1,
        description: 1
      }
    }
    ];

    const total = await this.devolucionModel.aggregate(countPipeline).then(res => res[0]?.total || 0);
    const result = await this.devolucionModel.aggregate(dataPipeline);

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

  async findOne(code: string) {
    return await this.devolucionModel.findOne({code}).populate([
      {
        path: 'activos', select: 'code name imageUrl category subcategory _id',
        populate: [
          { path: 'category', select: 'name _id' },
          { path: 'subcategory', select: 'name _id' },
          { path: 'status', select: 'name _id' }
        ]
      },
      {
        path: 'user_dev', select: 'grade name lastName ci _id',
        populate: {
          path: 'grade', select: 'name _id'
        }
      },
      {
        path: 'user_rec', select: 'grade name lastName ci _id',
        populate: {
          path: 'grade', select: 'name _id'
        }
      },
    ]);
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

  async update(id: string, updateDevolucionDto: UpdateDevolucionDto) {
    
    const devolucionExistente = await this.devolucionModel.findById(id);
    
        if (!devolucionExistente) {
          throw new NotFoundException('devolucion no encontrada');
        }
    
        if (updateDevolucionDto.documentUrl) {
          if (devolucionExistente.documentUrl) {
            const oldFilePath = join(
              __dirname,
              '..',
              '..',
              'uploads',
              'documents',
              devolucionExistente.documentUrl,
            );
            if (existsSync(oldFilePath)) {
              unlinkSync(oldFilePath);
            }
          }
        } else {
          updateDevolucionDto.documentUrl = devolucionExistente.documentUrl;
        }
        const activosAnteriores = devolucionExistente.activos.map((a: any) => a.toString());
        const nuevosActivos = updateDevolucionDto.activos || [];
    
        const removidos = activosAnteriores.filter((id) => !nuevosActivos.includes(id));
        const agregados = nuevosActivos.filter((id) => !activosAnteriores.includes(id));
    
        await Promise.all(
          removidos.map(async (id) => {
            await this.activosModel.findByIdAndUpdate(id, { disponibilidad: false });
          }),
        );
        await Promise.all(
          agregados.map(async (id) => {
            await this.activosModel.findByIdAndUpdate(id, { disponibilidad: true });
          }),
        );
        const devolucionActualizada = await this.devolucionModel.findByIdAndUpdate(
          id,
          {
            ...updateDevolucionDto,
            activos: nuevosActivos,
          },
          { new: true },
        );
    
        return devolucionActualizada;
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
