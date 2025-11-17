import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Activos, ActivosDocument } from './schema/activos.schema';
import { Model } from 'mongoose';
import { FiltersActivoDto } from './dto/filters-activo.dto';
import { parseDate } from 'src/utils/parse-date';
import { Status, StatusDocument } from './schema/status.schema';
import { Location, locationDocument } from './schema/location.schema';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { Contable, ContableDocument } from 'src/contable/schema/contable.schema';
import { SubCategory, SubCateGoryDocument } from 'src/contable/schema/sub-category.schema';
import { DisableEnamebleDto } from './dto/disbled-enable.dto';

@Injectable()
export class ActivosService {
  constructor(
    @InjectModel(Activos.name) private readonly activosModel: Model<ActivosDocument>,
    @InjectModel(Contable.name) private readonly categoryModel: Model<ContableDocument>,
    @InjectModel(SubCategory.name) private readonly subModel: Model<SubCateGoryDocument>,
    @InjectModel(Status.name) private readonly statusModel: Model<StatusDocument>,
    @InjectModel(Location.name) private readonly locationModel: Model<locationDocument>,
    @InjectModel(Users.name) private readonly UsersModel: Model<UsersDocument>,
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

  async findAll(filters: FiltersActivoDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const matchConditions: any[] = [];

    const words = field.trim().split(' ').filter(w => w !== '');

    if (words.length > 0) {
      const regexFilters = words.map(word => {
        const regex = new RegExp(word, 'i');
        return {
          $or: [
            { code: regex },
            { name: regex },
            { description: regex },
            { "location.name": regex },
            { "status.name": regex },
            { "category.name": regex },
            { "subcategory.name": regex },
            { "grade.name": regex },
            { "responsable.name": regex },
            { "responsable.lastName": regex }
          ]
        };
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

    const numValue = Number(field);
    if (!isNaN(numValue) && field.trim() !== "") {
      matchConditions.push({ price_a: numValue });
    }

    const pipeline: any[] = [
      { $lookup: { from: "locations", localField: "location", foreignField: "_id", as: "location" } },
      { $lookup: { from: "status", localField: "status", foreignField: "_id", as: "status" } },
      { $lookup: { from: "contables", localField: "category", foreignField: "_id", as: "category" } },
      { $lookup: { from: "subcategories", localField: "subcategory", foreignField: "_id", as: "subcategory" } },
      { $lookup: { from: "users", localField: "responsable", foreignField: "_id", as: "responsable" } },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$responsable", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "grades", localField: "responsable.grade", foreignField: "_id", as: "grade" } },
      { $unwind: { path: "$grade", preserveNullAndEmptyArrays: true } },

      ...(matchConditions.length > 0 ? [{ $match: { $or: matchConditions } }] : [])
    ];

    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [
      ...pipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Math.min(limit, 100) },
      {
        $project: {
          responsable: {
            _id: 1,
            name: 1,
            lastName: 1,
          },
          category: {
            _id: 1,
            name: 1
          },
          location: {
            _id: 1,
            name: 1
          },
          status: {
            _id: 1,
            name: 1
          },
          subcategory: {
            _id: 1,
            name: 1
          },
          grade: {
            _id: 1,
            name: 1
          },
          code: 1,
          name: 1,
          description: 1,
          date_a: 1,
          price_a: 1,
          createdAt: 1,
          imageUrl: 1

        }
      }
    ];

    const total = await this.activosModel.aggregate(countPipeline).then(res => res[0]?.total || 0);
    const result = await this.activosModel.aggregate(dataPipeline);

    return { result, total };
  }


  async findCategory() {
    return await this.categoryModel.find()
  }

  async findStatus(filters: FiltersActivoDto) {
    const { skip = 0, limit = 10 } = filters
    const result = await this.statusModel.find()
      .skip(skip)
      .limit(Math.min(limit, 100))
      .select('-__v')
    const total = await this.statusModel.countDocuments()
    return { result, total }
  }

  async findLocation(filters: FiltersActivoDto) {
    const { skip = 0, limit = 10 } = filters
    const result = await this.locationModel.find()
      .skip(skip)
      .limit(Math.min(limit, 100));
    const total = await this.locationModel.countDocuments()
    return { result, total }
  }


  async findOne(id: string) {
    return await this.activosModel.findById(id).populate([
      { path: 'location', select: '-__v' },
      {
        path: 'category', select: '-__v',
        populate: {
          path: 'subcategory', select: '-__v'
        }
      },
      { path: 'status', select: '-__v' },
      {
        path: 'responsable', select: 'name lastName ci _id grade',
        populate: {
          path: 'grade', select: '-__v'
        }
      },
      { path: 'subcategory', select: '-__v' }
    ]);
  }

  async searchCode(filters:FiltersActivoDto){
    const { field='' } = filters
    return await this.activosModel.findOne({code:field}).populate([
      { path: 'location', select: '-__v' },
      {
        path: 'category', select: '-__v',
        populate: {
          path: 'subcategory', select: '-__v'
        }
      },
      { path: 'status', select: '-__v' },
      { path: 'subcategory', select: '-__v' }
    ]);
  }

async disableActivo(disable: DisableEnamebleDto) {
  const activos = await this.activosModel.find({
    _id: { $in: disable.activos }
  }).populate([
      { path: 'location', select: '-__v' },
      {
        path: 'category', select: '-__v',
        populate: {
          path: 'subcategory', select: '-__v'
        }
      },
      { path: 'status', select: '-__v' },
      { path: 'subcategory', select: '-__v' }
    ]);

  const yaDeshabilitados = activos.filter(a => !a.disponibilidad);
  const porDeshabilitar = activos.filter(a => a.disponibilidad);

  const message = yaDeshabilitados.map(a =>
    `El activo ya está agregado, código del activo: ${a.code}`
  );

  if (porDeshabilitar.length > 0) {
    await this.activosModel.updateMany(
      { _id: { $in: porDeshabilitar.map(a => a._id) } },
      { $set: { disponibilidad: false } }
    );
  }

  return {
    updated: porDeshabilitar,
    alreadyAdded: yaDeshabilitados.length,
    message
  };
}

async enableActivo(id: string) {
  const enable = await this.activosModel.findByIdAndUpdate(
    id,
    { disponibilidad: true },
    { new: true } 
  );

  if (enable) {
    return {
      enable,
      ok: true,
    };
  }

  return {
    ok: false,
  };
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

  async avalaibles(filters: FiltersActivoDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const matchConditions: any[] = [];

    const words = field.trim().split(' ').filter(w => w !== '');

    if (words.length > 0) {
      const regexFilters = words.map(word => {
        const regex = new RegExp(word, 'i');
        return {
          $or: [
            { code: regex },
            { name: regex },
            { description: regex },
            { "location.name": regex },
            { "status.name": regex },
            { "category.name": regex },
            { "subcategory.name": regex },
          ]
        };
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

    const numValue = Number(field);
    if (!isNaN(numValue) && field.trim() !== "") {
      matchConditions.push({ price_a: numValue });
    }

    const pipeline: any[] = [
      { $lookup: { from: "locations", localField: "location", foreignField: "_id", as: "location" } },
      { $lookup: { from: "status", localField: "status", foreignField: "_id", as: "status" } },
      { $lookup: { from: "contables", localField: "category", foreignField: "_id", as: "category" } },
      { $lookup: { from: "subcategories", localField: "subcategory", foreignField: "_id", as: "subcategory" } },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },

       { $match: { disponibilidad: true } },

      ...(matchConditions.length > 0 ? [{ $match: { $or: matchConditions } }] : [])
    ];

    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [
      ...pipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Math.min(limit, 100) },
      {
        $project: {
          responsable: {
            _id: 1,
            name: 1,
            lastName: 1,
          },
          category: {
            _id: 1,
            name: 1
          },
          location: {
            _id: 1,
            name: 1
          },
          status: {
            _id: 1,
            name: 1
          },
          subcategory: {
            _id: 1,
            name: 1
          },
          code: 1,
          name: 1,
          imageUrl: 1

        }
      }
    ];

    const total = await this.activosModel.aggregate(countPipeline).then(res => res[0]?.total || 0);
    const result = await this.activosModel.aggregate(dataPipeline);

    return { result, total };
  }
}
