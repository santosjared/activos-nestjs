import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Actions } from 'src/action/schema/action.schema';
import { Subjects } from 'src/subject/schema/subject.schema';


export type PermissionDocument = HydratedDocument<Permission>

@Schema()
export class Permission {
    @Prop({ type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Actions' }] })
    action: Actions[]
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Subjects' })
    subject: Subjects;
   
    _id?: string
}

export const PermissionsSchema = SchemaFactory.createForClass(Permission);