import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rol, RolDocument } from './schema/roles.schema';
import { Model } from 'mongoose';
import { CreateRolDto } from './dto/create-roles.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { CreatePermissionDto } from 'src/permissions/dto/create-permission.dto';
import { Permission, PermissionDocument } from 'src/permissions/schema/persmissions.schema';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Rol.name) private readonly rolService: Model<RolDocument>,
        @InjectModel(Permission.name) private readonly permissionService: Model<PermissionDocument>
    ) { }

    async create(createRolDto: CreateRolDto) {
        try {
            return await this.rolService.create(createRolDto)
        } catch (e) {
            console.log('error al crear rol', e);
            throw new HttpException('interval server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(filters: any) {
        if (filters && filters.filter) {
            const query = {
                $or: [
                    { name: { $regex: filters.filter, $options: 'i' } },
                    { description: { $regex: filters.filter, $options: 'i' } },
                ]
            }

            const result = await this.rolService.find(query).populate({
                path: 'permissions',
                populate: [
                    { path: 'action' },
                    { path: 'subject' }
                ]
            }).skip(filters.skip).limit(filters.limit).exec()
            const total = await this.rolService.countDocuments(query)
            return { result, total };
        }
        const result = await this.rolService.find().populate({
            path: 'permissions',
            populate: [
                { path: 'action' },
                { path: 'subject' }
            ]
        })
        const total = await this.rolService.countDocuments()
        return { result, total }
    }

    async update(id: string, updateRolDto: UpdateRolDto) {
        return await this.rolService.findByIdAndUpdate(id, updateRolDto);
    }

    async delete(id: string) {
        return await this.rolService.findByIdAndDelete(id)
    }

   async asignePermission(id: string, createPermissions: CreatePermissionDto) {
  const permissions = await Promise.all(
    createPermissions.permissions.map(async per => {
      const created = await this.permissionService.create(per)
      return created._id
    })
  )

  return await this.rolService.findByIdAndUpdate(id, { permissions })
}

}
