import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Rol } from 'src/roles/schema/roles.schema';


export type UsersDocument = HydratedDocument<Users>

@Schema()
export class Users {

    @Prop()
    grade: string
    @Prop({ required: true })
    name: string
    @Prop({ required: true })
    lastName: string
    @Prop({ unique: true, required: true })
    email: string
    @Prop({ required: true })
    password: string
    @Prop({ required: true })
    phone: string
    @Prop()
    profile: string
    @Prop({type:[{ type: mongoose.SchemaTypes.ObjectId, ref: 'Rol', required: true }]})
    rol: Rol[]
    @Prop()
    ci: string
    @Prop()
    exp: string
    @Prop({ required: true })
    gender: 'masculino' | 'femenino' | 'Masculino' | 'Femenino' | 'MASCULINO' | 'FEMENINO'
    @Prop({ required: true })
    address: string
    @Prop({ type: String, default: 'activo' })
    status: 'activo' | 'inactivo'
}

export const UsersSchema = SchemaFactory.createForClass(Users)