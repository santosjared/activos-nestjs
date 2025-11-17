import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rol, RolDocument } from './schema/roles.schema';
import { Model, Types } from 'mongoose';
import { CreateRolDto } from './dto/create-roles.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionType } from 'src/types/permission-types';
import { mergePermissions } from 'src/utils/merged.permissions';
import { FiltersRolesDto } from './dto/filters-roles.dto';
import { Permission, PermissionDocument } from './schema/permission.schema';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>
    ) { }

    async create(createRolDto: CreateRolDto) {
        try {
            return await this.rolModel.create(createRolDto)
        } catch (e) {
            console.log('error al crear rol', e);
            throw new HttpException('interval server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(filters: FiltersRolesDto) {
        const { field, skip = 0, limit = 10 } = filters
        let query: any = { isRoot: { $ne: true } }
        if (field) {
            const orFilters: any[] = [
                { name: { $regex: field, $options: 'i' } },
                { description: { $regex: field, $options: 'i' } },
            ];
            query = { ...query, $or: orFilters };
        }

        const safeLimit = Math.min(limit, 100);

        const result = await this.rolModel.find(query)
            .select('-isRoot -__v -createdAt -updatedAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .exec()
        const total = await this.rolModel.countDocuments(query)
        return { result, total };
    }

    async findOne(id: string) {
        return await this.rolModel.findById(id)
    }

    async update(id: string, updateRolDto: UpdateRolDto) {
        const role = await this.rolModel.findById(id)
        if (!role) {
            throw new NotFoundException('Rol no encontrado')
        }
        if (role.isRoot) {
            throw new UnauthorizedException('no tienes autorizacion para actualizar este rol')
        }
        return await this.rolModel.findByIdAndUpdate(id, updateRolDto);
    }

    async delete(id: string) {
        const role = await this.rolModel.findById(id)
        if (!role) {
            throw new NotFoundException('Rol no encontrado')
        }
        if (role.isRoot) {
            throw new UnauthorizedException('no tienes autorizacion para eliminar este rol')
        }
        await Promise.all(
            role.permissions.map(async id => await this.permissionModel.findByIdAndDelete(id))
        )
        return await this.rolModel.findByIdAndDelete(id)
    }

   async asignePermission(id: string, createPermissions: CreatePermissionDto) {

    const role = await this.rolModel.findById(id).populate('permissions');
    if (!role) {
        throw new NotFoundException('Rol no encontrado');
    }
    if (role.isRoot) {
        throw new UnauthorizedException('No tienes autorización para actualizar este rol');
    }
    const currentPermissionIds = role.permissions.map(p => p._id.toString());

    const incomingIds = createPermissions.permissions
        .filter(p => p._id)
        .map(p => p._id);

    const idsToDelete = currentPermissionIds.filter(id => !incomingIds.includes(id));
    if (idsToDelete.length > 0) {
        await this.permissionModel.deleteMany({ _id: { $in: idsToDelete } });
    }

    const permissions = await Promise.all(
        createPermissions.permissions.map(async per => {
            if (per._id) {
                await this.permissionModel.findByIdAndUpdate(per._id, per);
                return per._id;
            } else {
                const created = await this.permissionModel.create(per);
                return created._id;
            }
        })
    );

    return await this.rolModel.findByIdAndUpdate(id, { permissions }, { new: true });
}


    async finPermissions(roleIds: Types.ObjectId[]): Promise<PermissionType[]> {
        if (!roleIds || roleIds.length === 0) return [];


        const roles = await this.rolModel.find({ _id: { $in: roleIds } }).populate('permissions').lean().exec();

        const allPermissions: any[] = roles.flatMap((rol) => rol.permissions || []);
        return mergePermissions(allPermissions);
    }

    async findRole(id:string){
        return await this.rolModel.findById(id).populate({
            path:'permissions',
            select:'-__v -isRoot'
        }).select('-__v -isRoot -createdAt -updatedAt -description').exec();
    }

}
