import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "src/activos/schema/category.schema";


@Injectable()
export class CategorySeed {
    constructor(@InjectModel(Category.name) private readonly CategoryModel: Model<CategoryDocument>) { }

    async seed() {
        try {
            const categories = [
                { name: 'terrenos y edificios' },
                { name: 'maquinaria y equipo' },
                { name: 'vehículos' },
                { name: 'mobiliario y enseres' }
            ]

            const addCategories = categories.map((category) => ({
                updateOne: {
                    filter: { name: category.name },
                    update: { $setOnInsert: category },
                    upsert: true,
                },
            }));
            await this.CategoryModel.bulkWrite(addCategories);
            console.log('Seed complete categories ✅');
        } catch (error) {
            console.error('Seed error:', error);
        }
    }


}