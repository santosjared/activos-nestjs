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
import { generateCode } from 'src/utils/generator.code';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

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
    console.log(createEntregaDto);

    let locationId = createEntregaDto.location;
    let gradeId = createEntregaDto.grade;

    if (createEntregaDto.otherLocation) {
      const newLocation = await this.locationModel.create({
        name: createEntregaDto.otherLocation,
      });
      locationId = newLocation._id.toString();
    }

    if (createEntregaDto.otherGrade) {
      const newGrade = await this.gradeModel.create({
        name: createEntregaDto.otherGrade,
      });
      gradeId = newGrade._id.toString();
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
      grade: gradeId,
      code: generateCode(),
      activos: activosIds.filter(Boolean),
    });

    return entrega;
  }


  async findAll(filters: FiltersEntregaDto) {
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
        { path: 'activos',
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
    return `This action returns a #${id} entrega`;
  }

  async findAvailables(filters: FiltersEntregaDto) {
  const { field = '', skip = 0, limit = 10, id } = filters;

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
  combinados.sort((a:any, b:any) => b.createdAt - a.createdAt);
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
  let gradeId = updateEntregaDto.grade;

  if (updateEntregaDto.otherLocation) {
    const newLocation = await this.locationModel.create({
      name: updateEntregaDto.otherLocation,
    });
    locationId = newLocation._id.toString();
  }
  if (updateEntregaDto.otherGrade) {
    const newGrade = await this.gradeModel.create({
      name: updateEntregaDto.otherGrade,
    });
    gradeId = newGrade._id.toString();
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
      grade: gradeId,
      activos: nuevosActivos,
    },
    { new: true },
  );

  return entregaActualizada;
}


  async remove(id: string) {
    const atendido = await this.entregaModel.findById(id)
    if(!atendido){
      throw new NotFoundException('entrega de productos no encontrado')
    }
    await Promise.all(
      atendido.activos.map(async id=>{
        await this.activosModel.findByIdAndUpdate(id,{disponibilidad:true})
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
}
