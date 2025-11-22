import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Grade, GradeDocument } from './schema/grade.schema';
import { FiltersUsersDto } from './dto/filters-user.dto';
import { Auth, AuthDocument } from 'src/auth/schema/auth.schema';
import { UserDto } from './dto/dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    @InjectModel(Grade.name) private readonly gradeModel: Model<GradeDocument>,
  ) { }
  async create(createUserDto: CreateUserDto) {

    if (!createUserDto.password) {
      throw new BadRequestException('La contraseña es requerida');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    if (createUserDto.otherGrade) {
      const { _id } = await this.gradeModel.create({ name: createUserDto.otherGrade });
      createUserDto.grade = _id.toString();
      delete createUserDto.otherGrade;
    }

    const existsUser = await this.userModel.findOne({
      tipo: { $ne: 'interno' },
      $or: [
        { email: createUserDto.email },
        { ci: createUserDto.ci }
      ]
    });

    if (existsUser) {

      await this.authModel.findByIdAndUpdate(existsUser.auth, {
        email: createUserDto.email,
        password: hashedPassword,
        roles: createUserDto.roles || [],
        fullName: `${createUserDto.name} ${createUserDto.lastName}`
      });

      return this.userModel.findByIdAndUpdate(
        existsUser._id,
        {
          ...createUserDto,
          tipo: 'interno',
          auth: existsUser.auth,
        },
        { new: true }
      );
    }


    const auth = await this.authModel.create({
      email: createUserDto.email,
      password: hashedPassword,
      roles: createUserDto.roles || [],
      fullName: `${createUserDto.name} ${createUserDto.lastName}`
    });

    return this.userModel.create({
      ...createUserDto,
      auth: auth._id,
      tipo: 'interno'
    });
  }


  async findAll(filters: FiltersUsersDto) {
    const { field = '', skip = 0, limit = 10 } = filters;

    const words = field.trim().split(' ').filter(w => w !== '');

    const regexFilters = words.map(word => {
      const regex = new RegExp(word, 'i');
      return {
        $or: [
          { name: regex },
          { lastName: regex },
          { ci: regex },
          { exp: regex },
          { address: regex },
          { phone: regex },
          { gender: regex },
          { email: regex },
          { status: regex },
          { "roles.name": regex },
          { "grade.name": regex },
        ]
      };
    });

    const pipeline: any[] = [
      { $match: { isRoot: { $ne: true } } },
      { $match: { tipo: 'interno' } },
      {
        $lookup: {
          from: "grades",
          localField: "grade",
          foreignField: "_id",
          as: "grade"
        }
      },
      { $unwind: { path: "$grade", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "auths",
          localField: "auth",
          foreignField: "_id",
          as: "authData"
        }
      },
      { $unwind: { path: "$authData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "rols",
          localField: "authData.roles",
          foreignField: "_id",
          as: "roles"
        }
      },
      ...(regexFilters.length > 0 ? [{ $match: { $and: regexFilters } }] : []),
    ];
    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [...pipeline,
    { $sort: { createdAt: -1 } },
    { $project: { password: 0 } },
    { $skip: skip },
    { $limit: Math.min(limit, 100) },
    {
      $project: {
        __v: 0,
        "auth": 0,
        "isRoot": 0,
        "createdAt": 0,
        "updatedAt": 0,
        "authData": 0,
        "roles.__v": 0,
        "roles.isRoot": 0,
        "roles.createdAt": 0,
        "roles.updatedAt": 0,
        "roles.permissions": 0,
        "grade.__v": 0,
        "tipo": 0
      }
    }
    ];
    const total = await this.userModel.aggregate(countPipeline).then(res => res[0] ? res[0].total : 0);
    const result = await this.userModel.aggregate(dataPipeline);
    return { result, total };
  }

  async findOne(id: string) {
    console.log(id)
    return await this.userModel.findOne({auth:id || ''})
    .select('name lastName ci grade _id')
    .populate({ path: 'grade', select: 'name _id' });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.isRoot) throw new BadRequestException('No se puede modificar el usuario root');

    const exists = await this.userModel.findOne({
      _id: { $ne: id },
      tipo: 'interno',
      $or: [{ email: dto.email }, { ci: dto.ci }],
    });

    if (exists) {
      throw new BadRequestException('Ya existe un usuario con ese correo o CI');
    }

    if (dto.otherGrade) {
      const { _id } = await this.gradeModel.create({ name: dto.otherGrade });
      dto.grade = _id.toString();
      delete dto.otherGrade;
    }

    let hashedPassword: string | undefined;

    if (dto.password) {
      hashedPassword = await bcrypt.hash(dto.password, 10);
      dto.password = hashedPassword;
    } else {
      delete dto.password;
    }

    const authUpdate: any = {};

    if (dto.email && dto.email !== user.email) {
      authUpdate.email = dto.email;
    }

    if (hashedPassword) {
      authUpdate.password = hashedPassword;
    }

    if (dto.roles) {
      authUpdate.roles = dto.roles;
    }
    if (dto.name || dto.lastName) {
      authUpdate.fullName = `${dto.name || user.name} ${dto.lastName || user.lastName}`;
    }

    if (Object.keys(authUpdate).length > 0) {
      await this.authModel.findByIdAndUpdate(user.auth, authUpdate);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    return updatedUser;
  }


  async dow(id: string) {
    return await this.userModel.findByIdAndUpdate(id, { status: 'inactivo' });
  }
  async up(id: string) {
    return await this.userModel.findByIdAndUpdate(id, { status: 'activo' })
  }

  async allUsersActive(filters: FiltersUsersDto) {
    const { field = '', skip = 0, limit = 10 } = filters
    const words = field.trim().split(' ').filter(w => w !== '');

    const regexFilters = words.map(word => {
      const regex = new RegExp(word, 'i');
      return {
        $or: [
          { name: regex },
          { lastName: regex },
          { ci: regex },
          { "grade.name": regex },
        ]
      };
    });

    const pipeline: any[] = [
      { $match: { status: 'activo' } },
      { $match: { tipo: 'interno' } },
      {
        $lookup: {
          from: "grades",
          localField: "grade",
          foreignField: "_id",
          as: "grade"
        }
      },
      { $unwind: { path: "$grade", preserveNullAndEmptyArrays: true } },
      ...(regexFilters.length > 0 ? [{ $match: { $and: regexFilters } }] : []),
    ];
    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [...pipeline,
    { $sort: { createdAt: -1 } },
    { $project: { password: 0 } },
    { $skip: skip },
    { $limit: Math.min(limit, 100) },
    {
      $project: {
        grade: {
          _id: 1,
          name: 1
        },
        name: 1,
        lastName: 1,
        ci: 1
      }
    }
    ];
    const total = await this.userModel.aggregate(countPipeline).then(res => res[0] ? res[0].total : 0);
    const result = await this.userModel.aggregate(dataPipeline);
    return { result, total };
  }
  async grades(filters: FiltersUsersDto) {
    const { skip = 0, limit = 10 } = filters;
    const safeLimit = Math.min(limit, 100);
    const result = await this.gradeModel.find().skip(skip).limit(safeLimit);
    const total = await this.gradeModel.countDocuments();
    return { result, total };
  }
  async checkEmail(email: string) {
    return await this.userModel.findOne({ email, tipo: 'interno' }) !== null;
  }
  async checkCi(ci: string) {
    return await this.userModel.findOne({ ci, tipo: 'interno' }) !== null;
  }
  async allUsers(filters: FiltersUsersDto) {
    const { field = '', skip = 0, limit = 10 } = filters
    const words = field.trim().split(' ').filter(w => w !== '');

    const regexFilters = words.map(word => {
      const regex = new RegExp(word, 'i');
      return {
        $or: [
          { name: regex },
          { lastName: regex },
          { ci: regex },
          { "grade.name": regex },
        ]
      };
    });

    const pipeline: any[] = [
      {
        $lookup: {
          from: "grades",
          localField: "grade",
          foreignField: "_id",
          as: "grade"
        }
      },
      { $unwind: { path: "$grade", preserveNullAndEmptyArrays: true } },
      ...(regexFilters.length > 0 ? [{ $match: { $and: regexFilters } }] : []),
    ];
    const countPipeline = [...pipeline, { $count: "total" }];
    const dataPipeline = [...pipeline,
    { $sort: { createdAt: -1 } },
    { $project: { password: 0 } },
    { $skip: skip },
    { $limit: Math.min(limit, 100) },
    {
      $project: {
        grade: {
          _id: 1,
          name: 1
        },
        name: 1,
        lastName: 1,
        ci: 1
      }
    }
    ];
    const total = await this.userModel.aggregate(countPipeline).then(res => res[0] ? res[0].total : 0);
    const result = await this.userModel.aggregate(dataPipeline);
    return { result, total };
  }

  async createUser(createDto: UserDto) {
  if (createDto.otherGrade) {
    const { _id } = await this.gradeModel.create({ name: createDto.otherGrade });
    createDto.grade = _id.toString();
    delete createDto.otherGrade;
  }

  if (createDto._id) {
    const userDB = await this.userModel.findById(createDto._id);
    if (!userDB) throw new Error('Usuario no encontrado');

    const updateData: any = {};
    const fields = ['name', 'lastName', 'ci', 'grade'];
    fields.forEach(field => {
      if (
        createDto[field] !== undefined &&
        createDto[field] !== null &&
        createDto[field] !== userDB[field]
      ) {
        updateData[field] = createDto[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return await this.userModel.findById(createDto._id)
        .select('name lastName ci grade _id')
        .populate({ path: 'grade', select: 'name _id' });
    }

    return await this.userModel.findByIdAndUpdate(
      createDto._id,
      { $set: updateData },
      { new: true }
    )
      .select('name lastName ci grade _id')
      .populate({ path: 'grade', select: 'name _id' });
  }

  const newUser = await this.userModel.create(createDto);

  return await this.userModel.findById(newUser._id)
    .select('name lastName ci grade _id')
    .populate({ path: 'grade', select: 'name _id' });
}


}
