import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';
import { Grade, GradeDocument } from './schema/grade.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly RolService: Model<RolDocument>,
    @InjectModel(Grade.name) private readonly gradeModel:Model<GradeDocument>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10)
    if(createUserDto.otherGrade){
      const { _id } = await this.gradeModel.create({name:createUserDto.otherGrade})
      createUserDto.grade = _id.toString()
    }
    return await this.userService.create({ ...createUserDto, password })
  }

  async findAll(filters: any) {

    const { field = '', skip = 0, limit = 10 } = filters
    const matchedRoles = await this.RolService.find({ name: { $regex: field, $options: 'i' } }).select('_id')
    const matchedGrades = await this.gradeModel.find({ name: { $regex: field, $options: 'i' } }).select('_id')
    const query = {
      $or: [
        { grade: { $in: matchedGrades.map(r => r._id) } },
        { name: { $regex: field, $options: 'i' } },
        { lastName: { $regex: field, $options: 'i' } },
        { ci: { $regex: field, $options: 'i' } },
        { exp: { $regex: field, $options: 'i' } },
        { address: { $regex: field, $options: 'i' } },
        { phone: { $regex: field, $options: 'i' } },
        { gender: { $regex: field, $options: 'i' } },
        { email: { $regex: field, $options: 'i' } },
        { rol: { $in: matchedRoles.map(r => r._id) } },
        { status: { $regex: field, $options: 'i' } },
      ]
    }

    const result = await this.userService.find(query).populate('rol grade').select('-password -__v').skip(skip).limit(limit).exec()
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
    if(updateUserDto.otherGrade){
      const { _id } = await this.gradeModel.create({name:updateUserDto.otherGrade})
      updateUserDto.grade = _id.toString()
    }

    return await this.userService.findByIdAndUpdate(id, updateData)
  }

  async dow(id: string) {
    return await this.userService.findByIdAndUpdate(id, { status: 'inactivo' });
  }
  async up(id: string) {
    return await this.userService.findByIdAndUpdate(id, { status: 'activo' })
  }

  async allUsersActive(){
    return await this.userService.find({status:'activo'}).populate('grade')
  }
  async grades(){
    return await this.gradeModel.find()
  }
  async checkEmail(email:string){
        return await this.userService.findOne({email}) !==null;
    }
}
