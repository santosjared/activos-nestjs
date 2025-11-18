import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Entrega, EntregaDocument } from './schema/entrega.schema';
import { Model } from 'mongoose';
import { parseDate } from 'src/utils/parse-date';
import { Activos, ActivosDocument } from 'src/activos/schema/activos.schema';
import { Contable, ContableDocument } from 'src/contable/schema/contable.schema';
import { SubCategory, SubCateGoryDocument } from 'src/contable/schema/sub-category.schema';
import { Status, StatusDocument } from 'src/activos/schema/status.schema';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { Location, locationDocument } from 'src/activos/schema/location.schema';
import { FiltersEntregaDto } from './dto/filters-activo.dto';
import { Grade, GradeDocument } from 'src/users/schema/grade.schema';
import { unlinkSync, existsSync } from 'fs';
import path, { join } from 'path';

@Injectable()
export class EntregaService {
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
  async create(createEntregaDto: CreateEntregaDto) {

    let locationId = createEntregaDto.location;

    if (createEntregaDto.otherLocation) {
      const newLocation = await this.locationModel.create({
        name: createEntregaDto.otherLocation,
      });
      locationId = newLocation._id.toString();
    }

    const activosIds = await Promise.all(
      createEntregaDto.activos.map(async (id) => {
        const updatedActivo = await this.activosModel.findByIdAndUpdate(
          id,
          { disponibilidad: false },
          { new: true }
        );
        return updatedActivo?._id;
      })
    );

    const entrega = await this.entregaModel.create({
      ...createEntregaDto,
      location: locationId,
      activos: activosIds.filter(Boolean),
    });

    return entrega;
  }


  async findAll(filters: FiltersEntregaDto) {
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
            { 'user_en.grade.name': regex },
            { 'user_en.name': regex },
            { 'user_en.lastName': regex },
            { 'location.name': regex }
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
      { $lookup: { from: "locations", localField: "location", foreignField: "_id", as: "location" } },
      { $lookup: { from: "users", localField: "user_rec", foreignField: "_id", as: "user_rec" } },
      { $lookup: { from: "users", localField: "user_en", foreignField: "_id", as: "user_en" } },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$user_rec", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$user_en", preserveNullAndEmptyArrays: true } },

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
          localField: "user_en.grade",
          foreignField: "_id",
          as: "user_en.grade"
        }
      },
      { $unwind: { path: "$user_en.grade", preserveNullAndEmptyArrays: true } },

      ...(matchConditions.length > 0 ? [{ $match: { $or: matchConditions } }] : [])
    ];


    const countPipeline = [...pipeline, { $count: "total" }]
    const dataPipeline = [...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Math.min(limit, 100) },
    {
      $project: {
        user_en: {
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
        location: {
          _id: 1,
          name: 1
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

    const total = await this.entregaModel.aggregate(countPipeline).then(res => res[0]?.total || 0);
    const result = await this.entregaModel.aggregate(dataPipeline);

    return { result, total };
  }

  async findOne(id: string) {
    return await this.entregaModel.findById(id).populate([
      {
        path: 'activos', select: 'code name imageUrl location category subcategory _id',
        populate: [
          { path: 'location', select: 'name _id' },
          { path: 'category', select: 'name _id' },
          { path: 'subcategory', select: 'name _id' },
          { path: 'status', select: 'name _id' }
        ]
      },
      {
        path: 'user_en', select: 'grade name lastName ci _id',
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
      {
        path: 'location', select: 'name _id'
      }
    ]);
  }

  async findAvailables(filters: FiltersEntregaDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const id = ''
    let queryEntregados: any = {};
    let queryDisponibles: any = { disponibilidad: true };
    if (id) {
      const entrega = await this.entregaModel
        .findById(id)
        .populate('activos', '_id')
        .lean();

      if (!entrega) {
        throw new NotFoundException('Entrega no encontrada');
      }

      queryEntregados = { _id: { $in: entrega.activos.map((a: any) => a._id) } };
    }
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
        this.usersModel.find({
          $or: [
            { name: { $regex: field, $options: 'i' } },
            { lastName: { $regex: field, $options: 'i' } }
          ]
        }).select('_id')
      ]);

      const orFilters: any[] = [
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
        orFilters.push({ date_a: { $gte: startOfDay, $lte: endOfDay } });
      }

      const numValue = Number(field);
      if (!isNaN(numValue)) {
        orFilters.push({ price_a: numValue });
      }

      queryEntregados.$or = orFilters;
      queryDisponibles.$or = orFilters;
    }
    const [entregados, disponibles] = await Promise.all([
      id
        ? this.activosModel
          .find(queryEntregados)
          .populate([
            { path: 'status', select: '-__v' },
            { path: 'location', select: '-__v' },
            {
              path: 'responsable',
              select: '-__v -password',
              populate: { path: 'grade', select: '-__v' }
            },
            {
              path: 'category',
              select: '-__v',
              populate: { path: 'subcategory', select: '-__v' }
            },
            { path: 'subcategory', select: '-__v' }
          ])
        : [],
      this.activosModel
        .find(queryDisponibles)
        .populate([
          { path: 'status', select: '-__v' },
          { path: 'location', select: '-__v' },
          {
            path: 'responsable',
            select: '-__v -password',
            populate: { path: 'grade', select: '-__v' }
          },
          {
            path: 'category',
            select: '-__v',
            populate: { path: 'subcategory', select: '-__v' }
          },
          { path: 'subcategory', select: '-__v' }
        ])
    ]);
    const combinados = [...entregados, ...disponibles].filter(
      (v, i, self) => i === self.findIndex((t) => t._id.toString() === v._id.toString())
    );
    combinados.sort((a: any, b: any) => b.createdAt - a.createdAt);
    const paginados = combinados.slice(skip, skip + limit);

    return {
      result: paginados,
      total: combinados.length
    };
  }


  async update(id: string, updateEntregaDto: UpdateEntregaDto) {
    const entregaExistente = await this.entregaModel.findById(id);

    if (!entregaExistente) {
      throw new NotFoundException('Entrega no encontrada');
    }

    let locationId = updateEntregaDto.location;

    if (updateEntregaDto.otherLocation) {
      const newLocation = await this.locationModel.create({
        name: updateEntregaDto.otherLocation,
      });
      locationId = newLocation._id.toString();
    }

    if (updateEntregaDto.documentUrl) {
      if (entregaExistente.documentUrl) {
        const oldFilePath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'documents',
          entregaExistente.documentUrl,
        );
        if (existsSync(oldFilePath)) {
          unlinkSync(oldFilePath);
        }
      }
    } else {
      updateEntregaDto.documentUrl = entregaExistente.documentUrl;
    }
    const activosAnteriores = entregaExistente.activos.map((a: any) => a.toString());
    const nuevosActivos = updateEntregaDto.activos || [];

    const removidos = activosAnteriores.filter((id) => !nuevosActivos.includes(id));
    const agregados = nuevosActivos.filter((id) => !activosAnteriores.includes(id));

    await Promise.all(
      removidos.map(async (id) => {
        await this.activosModel.findByIdAndUpdate(id, { disponibilidad: true });
      }),
    );
    await Promise.all(
      agregados.map(async (id) => {
        await this.activosModel.findByIdAndUpdate(id, { disponibilidad: false });
      }),
    );
    const entregaActualizada = await this.entregaModel.findByIdAndUpdate(
      id,
      {
        ...updateEntregaDto,
        location: locationId,
        activos: nuevosActivos,
      },
      { new: true },
    );

    return entregaActualizada;
  }


  async remove(id: string) {
    const atendido = await this.entregaModel.findById(id)
    if (!atendido) {
      throw new NotFoundException('entrega de productos no encontrado')
    }
    await Promise.all(
      atendido.activos.map(async id => {
        await this.activosModel.findByIdAndUpdate(id, { disponibilidad: true })
      })
    )
    return await this.entregaModel.findByIdAndDelete(id);
  }

  async locations() {
    return await this.locationModel.find()
  }
  async grades() {
    return await this.gradeModel.find()
  }
  async categories() {
    return await this.categoryModel.find()
  }
  async subcategories() {
    return await this.subCategoryModel.find()
  }
  async status() {
    return await this.statusModel.find()
  }

  private generateCode(): string {
    const random = () =>
      Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 caracteres

    return `${random()}-${random()}-${random()}`;
  }

  async generateUniqueCode(): Promise<string> {
    let code = this.generateCode();
    let exists = await this.entregaModel.exists({ code });
    while (exists) {
      code = this.generateCode();
      exists = await this.entregaModel.exists({ code });
    }

    return code;
  }

}
