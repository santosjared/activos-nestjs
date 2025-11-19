import { GatewayTimeoutException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { InjectModel } from '@nestjs/mongoose';
import { Activos, ActivosDocument } from 'src/activos/schema/activos.schema';
import { Model } from 'mongoose';

@Injectable()
export class DepreciacionService {
  constructor(
    @InjectModel(Activos.name)
    private readonly activosModel: Model<ActivosDocument>
  ) {}
  private async getUFVByDate(date: string) {
    try {
      const [year, month, day] = date.split('-');

      const params = {
        sdd: day,
        smm: month,
        saa: year,
        edd: day,
        emm: month,
        eaa: year,
        Button: '  Ver  ',
        qlist: '1'
      };

      const url = 'https://www.bcb.gob.bo/librerias/indicadores/ufv/gestion.php';

      const response = await axios.get(url, { params, timeout: 30000 });
      const $ = cheerio.load(response.data);

      let ufvValue = 0;

      $('table.tablaborde tr').each((i, el) => {
        if (i === 0) return;
        const ufv = $(el).find('td').eq(2).text().trim();

        if (ufv) ufvValue = Number(ufv);
      });

      if (!ufvValue) throw new Error('UFV no encontrado');

      return { ufv: ufvValue };

    } catch (e) {
      console.log(e);
      throw new GatewayTimeoutException('HTTP 504 Gateway Time Out');
    }
  }

  private calcularDepreciacion(
    precio: number,
    vidaUtil: number,
    ufvInicial: number,
    ufvFinal: number,
    aniosUsados: number
  ) {
    const coeficiente = ufvFinal / ufvInicial;
    const precio_actualizado = precio * coeficiente;
    const depreciacionAnual = precio_actualizado / vidaUtil;
    const deprec_acomulada = depreciacionAnual * aniosUsados;
    const neto = precio_actualizado - deprec_acomulada;
    const diferencia_ufv = ufvFinal - ufvInicial;

    return {
      precio_actualizado,
      deprec_acomulada,
      neto,
      diferencia_ufv
    };
  }

 private calcularAniosUsados(fechaInicial: string, fechaFinal: string): number {
  const start = new Date(fechaInicial);
  const end = new Date(fechaFinal);

  const diffMs = end.getTime() - start.getTime();
  const anios = diffMs / (1000 * 60 * 60 * 24 * 365);

  return Number(anios.toFixed(4));
}

  async findAll(filters: any) {
    const {
      skip = 0,
      limit = 10,
      fecha_compra = '2025-11-12',
      fecha_final = '2025-11-12'
    } = filters;

    const activos = await this.activosModel
      .find({ date_a: fecha_compra })
      .populate([
        { path: 'category', select: 'util' },
        { path: 'subcategory', select: 'util' }
      ])
      .skip(skip)
      .limit(Math.min(limit, 100));

    if (activos.length === 0) return activos;

    let ufv_inicial = 0;
    let ufv_final = 0;
    if (fecha_compra === fecha_final) {
      const ufv = await this.getUFVByDate(fecha_compra);
      ufv_inicial = ufv.ufv;
      ufv_final = ufv.ufv;
    } else {
      const [ufv1, ufv2] = await Promise.all([
        this.getUFVByDate(fecha_compra),
        this.getUFVByDate(fecha_final)
      ]);

      ufv_inicial = ufv1.ufv;
      ufv_final = ufv2.ufv;
    }

    return activos.map(activo => {
      const vidaUtil =
        activo.subcategory?.util ||
        activo.category?.util ||
        0;

      return {
        nombre: activo.name,
        fecha_a: activo.date_a,
        precio_ac: activo.price_a,
        ufv_inicial,
        ufv_final,
        ...this.calcularDepreciacion(
          activo.price_a,
          vidaUtil,
          ufv_inicial,
          ufv_final,
          this.calcularAniosUsados(fecha_compra, fecha_final)
        )
      };
    });
  }
}
