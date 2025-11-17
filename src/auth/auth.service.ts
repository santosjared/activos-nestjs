import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreadencialesAuthDto } from './dto/credenciales-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth, AuthDocument } from './schema/auth.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }
  async login(credentialsAuthDto: CreadencialesAuthDto) {
    const { rememberMe=true, email, password } = credentialsAuthDto;
    const auth = await this.findCredentials(email);
    if (auth) {
      const passwordHash = await bcrypt.compare(password, auth.password);
      if (passwordHash) {
        const payload = { sub: auth._id }
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: rememberMe?'30d':'1d', secret:this.configService.get('JWT_REFRESH_SECRET') } );
        await this.authModel.findByIdAndUpdate(auth._id, { isActive:true})
        const {password, ...authObj} = auth.toObject();
        return {
          access_token,
          refresh_token,
          user:authObj
        };
      }
      throw new UnauthorizedException('password incorect')
    }
    throw new UnauthorizedException('email incorect')
  }

  async findCredentials(param: string) {
    const isObjectId = Types.ObjectId.isValid(param);
    const query = isObjectId ? { _id: param } : { email: param };

    const auth = await this.authModel.findOne(query).populate({
      path: 'roles', select: '-__v -_id -createdAt -updatedAt -isRoot',
      populate: { path: 'permissions', select: '-__v -_id -isRoot' }
    }).select('-__v -createdAt -updatedAt -isRoot');
    return auth;
  }
  
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token,{ secret:this.configService.get('JWT_REFRESH_SECRET') });

      const auth = await this.findCredentials(payload.sub);

      if ( auth && !auth?.isActive) {
        throw new UnauthorizedException('Token no válido');
      }
      const access_token = this.jwtService.sign({ sub: payload.sub });
      const {password, ...authObj} = auth?.toObject() || {};
      return {
        access_token,
        user: authObj
      };
    } catch (e) {
      throw new UnauthorizedException('Token no válido');
    }
  }

  async logout(id: string) {
    try {
      const remove = await this.authModel.findByIdAndUpdate(id, { isActive: false });

      if (!remove) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return remove;
    } catch (error) {

      console.error('Error en logout: ', error);
      throw new InternalServerErrorException('Hubo un error al cerrar sesión');
    }
  }

  findOne(id: string) {
    return this.authModel.findById(id).select('-password -__v -createdAt -updatedAt');
  } 
}