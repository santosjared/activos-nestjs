import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Entrega, EntregaDocument } from 'src/entrega/schema/entrega.schema';
import { Model } from 'mongoose';
import { Activos, ActivosDocument } from 'src/activos/schema/activos.schema';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(Entrega.name) private readonly entregaModel: Model<EntregaDocument>,
    @InjectModel(Activos.name) private readonly activosModel: Model<ActivosDocument>,
  ) { }


  private async mostBorrowed() {
  return this.entregaModel.aggregate([
    { $unwind: "$activos" },
    {
      $group: {
        _id: "$activos",
        total: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "activos",
        localField: "_id",
        foreignField: "_id",
        as: "activo"
      }
    },
    { $unwind: "$activo" },
    {
      $project: {
        total: 1,
        activo: {
          name: "$activo.name",
          code: "$activo.code",
          imageUrl: "$activo.imageUrl"
        }
      }
    }
  ]);
}

private async topByPrice() {
  return this.activosModel
    .find()
    .sort({ price_a: -1 })
    .limit(4)
    .select("name code price_a imageUrl");
}

private async countByStatus() {
  const statusFilter = ["Bueno", "Regular", "Malo", "Mantenimiento"];

  const counts = await this.activosModel.aggregate([
    {
      $lookup: {
        from: "status",
        localField: "status",
        foreignField: "_id",
        as: "statusData"
      }
    },
    { $unwind: "$statusData" },
    {
      $match: { "statusData.name": { $in: statusFilter } }
    },
    {
      $group: {
        _id: "$statusData.name",
        total: { $sum: 1 }
      }
    },
    {
      $project: {
        status: "$_id",
        total: 1,
        _id: 0
      }
    }
  ]);
  const result = statusFilter.map(s => {
    const found = counts.find(c => c.status === s);
    return { status: s, total: found ? found.total : 0 };
  });

  return result;
}

 async findAll() {

  const [
    statusCount,
    topPrice,
    topPrestados,
  ] = await Promise.all([
    this.countByStatus(),
    this.topByPrice(),
    this.mostBorrowed(),
  ]);

  return {
    totalStatus: statusCount,
    topActivosPorPrecio: topPrice,
    topActivosPrestados: topPrestados
  };
}


}
