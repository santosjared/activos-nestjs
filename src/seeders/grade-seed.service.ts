import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "src/activos/schema/category.schema";
import { Grade, GradeDocument } from "src/users/schema/grade.schema";


@Injectable()
export class GradeSeed {
    constructor(@InjectModel(Grade.name) private readonly gardeModel: Model<GradeDocument>) { }

    async seed() {
        try {
            const grades:Grade[] = [
                { name: 'Cnl. MSc. CAD.' },
                { name: 'TCNL. DEAP.' },
                { name: 'MY.' },
                { name: 'TTTE.' },
                { name: 'SBTTE.' },
                { name: 'CAP.' },
                { name: 'SOF. SUP.' },
                { name: 'SOF. MY.' },
                { name: 'SOF. 1RO.' },
                { name: 'SOF. 2DO.' },
                { name: 'SGTO. MY.' },
                { name: 'SGTO. 1RO.' },
                { name: 'SGTO. 2DO.' },
                { name: 'SGTO.' },
            ]

            const addGrades = grades.map((grade) => ({
                updateOne: {
                    filter: { name: grade.name },
                    update: { $setOnInsert: grade },
                    upsert: true,
                },
            }));
            await this.gardeModel.bulkWrite(addGrades);
            console.log('Seed complete Grades✅');
        } catch (error) {
            console.error('Seed error in grade:', error);
        }
    }


}