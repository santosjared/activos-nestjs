import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Gender } from './gender.schema';
import { Rol } from 'src/roles/schema/roles.schema';


export type UsersDocument = HydratedDocument<Users>

@Schema()
export class Users {

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
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Rol', required: true })
    rol: Rol
    @Prop()
    ci: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Gender' })
    gender: Gender
    @Prop({ required: true })
    address: string
    @Prop()
    otherGender: string
    @Prop({ type: String, default: 'activo' })
    status: string
}

export const UsersSchema = SchemaFactory.createForClass(Users)