import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly RolService: Model<RolDocument>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10)
    return await this.userService.create({ ...createUserDto, password })
  }

  async findAll(filters: any) {

    const { field = '', skip = 0, limit = 10 } = filters
    const matchedRoles = await this.RolService.find({ name: { $regex: field, $options: 'i' } }).select('_id')
    const query = {
      $or: [
        { name: { $regex: field, $options: 'i' } },
        { lastName: { $regex: field, $options: 'i' } },
        { email: { $regex: field, $options: 'i' } },
        { ci: { $regex: field, $options: 'i' } },
        { address: { $regex: field, $options: 'i' } },
        { phone: { $regex: field, $options: 'i' } },
        { rol: { $in: matchedRoles.map(r => r._id) } }
      ]
    }

    const resultDB = await this.userService.find(query).populate('rol').skip(skip).limit(limit).exec()
    const result = resultDB.map(user => {
      const { password, ...newUser } = user.toObject();
      return newUser;
    });
    const total = await this.userService.countDocuments(query)
    return { result, total };
  }

  async findOne(email: string) {
    return await this.userService.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateData: any = { ...updateUserDto }
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10)
    } else {
      delete updateData.password
    }

    return await this.userService.findByIdAndUpdate(id, updateData)
  }

  async dow(id: string) {
    return await this.userService.findByIdAndUpdate(id, { status: 'inactivo' });
  }
  async up(id: string) {
    return await this.userService.findByIdAndUpdate(id, { status: 'activo' })
  }
}
