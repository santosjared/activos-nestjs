import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Permission } from './permission.schema';

export type RolDocument = HydratedDocument<Rol>

@Schema({ timestamps: true })
export class Rol {

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] })
    permissions: Types.ObjectId[];

    @Prop()
    description: string

    @Prop({ default: false })
    isRoot: boolean;
}

export const RolSchema = SchemaFactory.createForClass(Rol);
