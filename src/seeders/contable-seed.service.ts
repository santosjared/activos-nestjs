import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contable, ContableDocument } from "src/contable/schema/contable.schema";


@Injectable()
export class ContableSeed {
    constructor(@InjectModel(Contable.name) private readonly contableModel: Model<ContableDocument>) { }

    async seed() {
        try {
            const categories:Contable[] = [
                { name: 'Muebles y enseres', util:10, subcategory:[] },
                { name: 'Equipos de computación', util:4, subcategory:[] },
                { name: 'Vehículos', util:5, subcategory:[] }
            ]

            const addCategories = categories.map((category) => ({
                updateOne: {
                    filter: { name: category.name },
                    update: { $setOnInsert: category },
                    upsert: true,
                },
            }));
            await this.contableModel.bulkWrite(addCategories);
            console.log('Seed complete Contable ✅');
        } catch (error) {
            console.error('Seed error:', error);
        }
    }


}