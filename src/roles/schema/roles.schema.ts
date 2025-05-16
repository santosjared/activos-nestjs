import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schema/persmissions.schema';

export type RolDocument = HydratedDocument<Rol>

@Schema()
export class Rol {

    @Prop({ required: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] })
    permissions: Permission[];

    @Prop()
    description:string
}

export const RolSchema = SchemaFactory.createForClass(Rol);
