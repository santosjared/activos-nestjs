import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contable, ContableDocument } from './schema/contable.schema';
import { Model } from 'mongoose';
import { FiltersContableDto } from './dto/filters-contable.dto';
import { SubCategory, SubCateGoryDocument } from './schema/sub-category.schema';
import { CreateContableDto } from './dto/create-contable.dto';
import { UpdateContableDto } from './dto/update-contable.dto';

@Injectable()
export class ContableService {
    constructor(@InjectModel(Contable.name) private readonly contableModel: Model<ContableDocument>,
        @InjectModel(SubCategory.name) private readonly subModel: Model<SubCateGoryDocument>,
    ) { }

    async create(createContableDto: CreateContableDto) {

        const subIds = await Promise.all(
            createContableDto.subcategory?.map(async (sub) => {
                const { _id } = await this.subModel.create(sub)
                return _id.toString()
            }) || []
        )
        const contable = await this.contableModel.create({
            ...createContableDto,
            subcategory: subIds
        })

        return contable
    }

    async findAll(filters: FiltersContableDto) {
        const { field = '', skip = 0, limit = 10 } = filters
        let query: any = {}
        if (field) {
            const numValue = Number(field)
            const isNumber = !isNaN(numValue)

            const matchSub = await this.subModel.find({
                $or: [
                    { name: { $regex: field, $options: 'i' } },
                    ...(isNumber ? [{ util: numValue }] : [])
                ]
            })

            query = {
                $or: [
                    { name: { $regex: field, $options: 'i' } },
                    ...(isNumber ? [{ util: numValue }] : []),
                    { subcategory: { $in: matchSub.map(r => r._id) } },
                    { description: { $regex: field, $options: 'i' } },
                ]
            }
        }

        const result = await this.contableModel.find(query).populate({
            path:'subcategory',
            select:'-__v'
        })
            .skip(skip)
            .limit(limit)
            .select('-__v -subcategory')
            .sort({ createdAt: -1 });

        const total = await this.contableModel.countDocuments(query)
        return { result, total }
    }
    async findSub() {
        return await this.subModel.find()
    }
    async update(id: string, updateContableDto: UpdateContableDto) {
        const contable = await this.contableModel.findById(id).populate('subcategory');
        if (!contable) throw new Error('Denuncia no encontrada');
        const existingIds = contable.subcategory.map((i: any) => i._id.toString());
        const newSubCategory = updateContableDto.subcategory || [];

        const toUpdate = newSubCategory.filter((i) => i._id && existingIds.includes(i._id));
        const toCreate = newSubCategory.filter((i) => !i._id);
        const toDelete = existingIds.filter((id) => !newSubCategory.some((i) => i._id === id));

        const created = await Promise.all(
            toCreate.map(async (sub) => {
                const { _id } = await this.subModel.create(sub);
                return _id.toString();
            })
        );

        await Promise.all(
            toUpdate.map(async (sub) => {
                await this.subModel.findByIdAndUpdate(sub._id, sub);
            })
        );
        await Promise.all(
            toDelete.map(async (subId) => {
                await this.subModel.findByIdAndDelete(subId);
            })
        );

        const finalIds = [
            ...toUpdate.map((i) => i._id),
            ...created
        ];
        const updatedContable = await this.contableModel.findByIdAndUpdate(
            id,
            {
                ...updateContableDto,
                subcategory: finalIds
            },
            { new: true }
        );

        return updatedContable;
    }

    async findOne(id:string){
        return await this.contableModel.findById(id).populate({
            path:'subcategory',
            select:'-__V'
        }).select('-__v')
    }

    async remove(id: string) {
        const contable = await this.contableModel.findById(id)
        if (!contable) throw new Error('Denuncia no encontrada');
        await Promise.all(
            contable.subcategory.map(async (id) => {
                await this.subModel.findByIdAndDelete(id);
            })
        )
        return await this.contableModel.findByIdAndDelete(id);
    }
}

