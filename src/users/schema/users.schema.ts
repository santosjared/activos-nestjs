import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Grade } from './grade.schema';


export type UsersDocument = HydratedDocument<Users>

@Schema({timestamps:true, autoIndex: false })
export class Users {

    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Grade'})
    grade?:Grade 
    @Prop({ required: true })
    name: string
    @Prop()
    lastName?: string
    @Prop()
    email: string
    @Prop()
    phone?: string
    @Prop()
    profile?: string
    @Prop()
    ci?: string
    @Prop()
    exp?: string
    @Prop()
    gender?: 'masculino' | 'femenino' | 'Masculino' | 'Femenino' | 'MASCULINO' | 'FEMENINO'
    @Prop()
    address?: string
    @Prop({ type: String, default: 'activo' })
    status?: 'activo' | 'inactivo'
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Auth'})
    auth?: Types.ObjectId;

    @Prop({ default: false })
    isRoot: boolean;

    @Prop({default:'externo'})
    tipo?:'interno' | 'externo' | 'System'
}

export const UsersSchema = SchemaFactory.createForClass(Users)