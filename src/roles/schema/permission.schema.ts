import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Actions, Subjects } from 'src/types/permission-types';

export type PermissionDocument = HydratedDocument<Permission>


@Schema()
export class Permission {
  @Prop()
  action: Actions[];

  @Prop()
  subject: Subjects;

  @Prop({ default: false })
  isRoot: boolean;
}

export const PermissionsSchema = SchemaFactory.createForClass(Permission);