import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Location, locationDocument } from "src/activos/schema/location.schema";


@Injectable()
export class LocationSeed {
    constructor(@InjectModel(Location.name) private readonly LocationModel: Model<locationDocument>) { }

    async seed() {
        try {
            const locations = [
                { name: 'SECRETARÍA' },
                { name: 'RELACIONES PÚBLICAS' },
                { name: 'ASESORIA LEGAL' },
                { name: 'DIVISIÓN DE RECURSOS HUMANOS' },
                { name: 'DIVISIÓN DE PLANIFICACIÓN Y OPERACIONES' },
                { name: 'DIVISIÓN ADMINISTRATIVO' },
                { name: 'DIVISIÓN PREVENCIÓN, PROTECCIÓN Y SEGURIDAD HUMANA' },
                { name: 'DIVISIÓN INVESTIGACIÓN TÉCNICA' },
            ]

            const addLocation = locations.map((location) => ({
                updateOne: {
                    filter: { name: location.name },
                    update: { $setOnInsert: location },
                    upsert: true,
                },
            }));
            await this.LocationModel.bulkWrite(addLocation);
            console.log('Seed complete Ubicacion ✅');
        } catch (error) {
            console.error('Seed error:', error);
        }
    }


}