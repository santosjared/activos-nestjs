import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { Gender, GenderDocument } from './schema/gender.schema';
import * as bcrypt from 'bcrypt';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly RolService: Model<RolDocument>,
    @InjectModel(Gender.name) private readonly genderService: Model<GenderDocument>
  ) { }
  async create(createUserDto: CreateUserDto) {
    let otherGender:any=null
    if(createUserDto.otherGender){
      otherGender = await this.genderService.create({ name: createUserDto.otherGender });
    }
    const password = await bcrypt.hash(createUserDto.password,10)
     return await this.userService.create({...createUserDto, gender:otherGender?otherGender._id:createUserDto.gender , password})
  }

  async findAll(filters: any) {
    if (filters && filters.filter) {
      const matchedGenders = await this.genderService.find({ name: { $regex: filters.filter, $options: 'i' } }).select('_id')
      const matchedRoles = await this.RolService.find({ name: { $regex: filters.filter, $options: 'i' } }).select('_id')
      const query = {
        $or: [
          { name: { $regex: filters.filter, $options: 'i' } },
          { lastName: { $regex: filters.filter, $options: 'i' } },
          { email: { $regex: filters.filter, $options: 'i' } },
          { ci: { $regex: filters.filter, $options: 'i' } },
          { address: { $regex: filters.filter, $options: 'i' } },
          { phone: { $regex: filters.filter, $options: 'i' } },
          { gender: { $in: matchedGenders.map(g => g._id) } },
          { rol: { $in: matchedRoles.map(r => r._id) } }
        ]
      }

      const result = await this.userService.find(query).populate('gender').populate('rol').skip(filters.skip).limit(filters.limit).exec()
      const total = await this.userService.countDocuments(query)
      return { result, total };
    }
    const result = await this.userService.find().populate('gender').populate('rol')
    const total = await this.userService.countDocuments()
    return { result, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

async update(id: string, updateUserDto: UpdateUserDto) {
  const updateData: any = { ...updateUserDto }
  if (updateUserDto.otherGender) {
    const otherGender = await this.genderService.create({ name: updateUserDto.otherGender })
    updateData.gender = otherGender._id
  }
  if (updateUserDto.password) {
    updateData.password = await bcrypt.hash(updateUserDto.password, 10)
  } else {
    delete updateData.password
  }

  return await this.userService.findByIdAndUpdate(id, updateData)
}

  async dow(id: string) {
    return await this.userService.findByIdAndUpdate(id,{status:'inactivo'});
  }
  async up(id: string){
    return await this.userService.findByIdAndUpdate(id,{status:'activo'})
  }
  async findAllGender(){
    return await this.genderService.find()
  }
}
