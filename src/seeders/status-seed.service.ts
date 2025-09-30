import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "src/activos/schema/category.schema";
import { Status, StatusDocument } from "src/activos/schema/status.schema";


@Injectable()
export class StatusSeed {
    constructor(@InjectModel(Status.name) private readonly StatusModel: Model<StatusDocument>) { }

    async seed() {
        try {
            const status = [
                { name: 'Bueno' },
                { name: 'Regular' },
                { name: 'Malo' },
            ]

            const addStatus = status.map((statu) => ({
                updateOne: {
                    filter: { name: statu.name },
                    update: { $setOnInsert: statu },
                    upsert: true,
                },
            }));
            await this.StatusModel.bulkWrite(addStatus);
            console.log('Seed complete status ✅');
        } catch (error) {
            console.error('Seed error:', error);
        }
    }


}