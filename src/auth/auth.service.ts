import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { JwtService } from '@nestjs/jwt';
import { SingIn, SingInDocument } from './schema/sing-in.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(SingIn.name) private readonly singIn: Model<SingInDocument>,
    private jwtService: JwtService
  ) { }
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.findUser(createAuthDto.email);
    if (user) {
      const passwordHash = await bcrypt.compare(createAuthDto.password, user.password);
      if (passwordHash) {
        const payload = { sub: user._id }
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
        const isAuthenticated = await this.singIn.findOne({ userId: user._id });

        if (!isAuthenticated) {
          await this.singIn.create({ userId: user._id });
        } else {
          await this.singIn.findOneAndUpdate(
            { userId: user._id },
            { $set: { updatedAt: new Date() } }
          );
        }
        // const populateRoles = await user.populate('role')
        return {
          access_token,
          refresh_token,
          userData: { name: user.name, lastName: user.lastName, email: user.email, userId: user._id, role: user.rol },
        };
      }
      throw new UnauthorizedException('password incorect')
    }
    throw new UnauthorizedException('email incorect')
  }

  async findUser(param: string) {
    const isObjectId = Types.ObjectId.isValid(param);
    const query = isObjectId ? { _id: param } : { email: param };

    const user = await this.userService.findOne(query).populate({
      path: 'rol',
      populate: {
        path: 'permissions',
        populate: [
          { path: 'action' },
          { path: 'subject' }
        ]
      }
    });
    return user;

  }
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const getToken = await this.singIn.findOne({ userId: payload.sub });

      if (!getToken) {
        throw new BadRequestException('Token no válido');
      }

      const user = await this.findUser(payload.sub);
      if (user) {
        const access_token = this.jwtService.sign({ sub: payload.sub });
        const refresh_token = this.jwtService.sign(
          { sub: payload.sub },
          { expiresIn: '30d' },
        );

        return {
          access_token,
          refresh_token,
          userData: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            userId: user.id,
            role: user.rol
          },
        };
      }
      throw new BadRequestException('Token no válido');
    } catch (e) {
      console.error('Error en refresco de token: ', e);
      throw new BadRequestException('Token no válido');
    }
  }

  async logout(userId: string) {
    try {
      const remove = await this.singIn.findOneAndDelete({ userId });

      if (!remove) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return remove;
    } catch (error) {

      console.error('Error en logout: ', error);
      throw new InternalServerErrorException('Hubo un error al cerrar sesión');
    }
  }


}
