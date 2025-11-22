import { Injectable } from '@nestjs/common';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { UpdateBitacoraDto } from './dto/update-bitacora.dto';
import { FiltersBitacoraDto } from './dto/filters-bitacora.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bitacoras, BitacorasDocument } from './schema/bitacoras.schema';
import { Model } from 'mongoose';

@Injectable()
export class BitacorasService {

  constructor(@InjectModel(Bitacoras.name) private readonly bitacoraModel:Model<BitacorasDocument>){}

  async findAll(filters:FiltersBitacoraDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const matchConditions: any[] = [];

    const words = field.trim().split(' ').filter(w => w !== '');

  if(words.length>0){
      const regexFilters = words.map(word => {
      const regex = new RegExp(word, 'i');
      return {
        $or: [
          { action: regex },
          { method: regex },
          { logs: regex },
          { "roles.name": regex },
          { "grade.name": regex },
        ]
      };
    });
    if(regexFilters.length> 0){
      matchConditions.push({ $and: regexFilters });
    }
  }

  const normalized = this.normalizeToYMD(field);
  if(normalized){
    const startOfDay = new Date(`${normalized}T00:00:00.000Z`);
    const endOfDay = new Date(`${normalized}T23:59:59.999Z`);
    matchConditions.push({
      createdAt:{ $gte: startOfDay, $lt: endOfDay }
    });
  }

  const pipeline: any[] = [
  {
    $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" }
  },
  { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
  {
    $lookup: { from: "grades", localField: "user.grade", foreignField: "_id", as: "user.grade" }
  },
  { $unwind: { path: "$user.grade", preserveNullAndEmptyArrays: true } },
  {
    $lookup: { from: "auths", localField: "user.auth", foreignField: "_id", as: "user.auth" }
  },
  { $unwind: { path: "$user.auth", preserveNullAndEmptyArrays: true } },
  {
    $lookup: { from: "rols", localField: "user.auth.roles", foreignField: "_id", as: "rolesTemp" }
  },
  { $addFields: { "user.roles": "$rolesTemp" } },
  { $project: { rolesTemp: 0 } },
  ...(matchConditions.length > 0 ? [{ $match: { $and: matchConditions } }] : [])
];
    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Math.min(limit, 100) },
    ];
    const total = await this.bitacoraModel.aggregate(countPipeline).then(res => res[0] ? res[0].total : 0);
    const result = await this.bitacoraModel.aggregate(dataPipeline);
    return { result, total };
  }

 private convertirFormDate(field: string) {
        const isISODate = /^\d{4}-\d{2}-\d{2}$/.test(field);
        const isShortDate = /^\d{2}\/\d{2}\/\d{4}$/.test(field);

        if (!isISODate && !isShortDate) return null;

        let year: string, month: string, day: string;

        if (isShortDate) {
            [day, month, year] = field.split('/');
        } else {
            [year, month, day] = field.split('-');
        }
        return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    }

    private normalizeToYMD(field: string): string | null {
        const date = this.convertirFormDate(field);
        if (!date) return null;

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
