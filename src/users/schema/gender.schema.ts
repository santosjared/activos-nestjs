import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GenderDocument = HydratedDocument<Gender>

@Schema()
export class Gender{

    @Prop()
    name:string
    
}

export const GenderSchema = SchemaFactory.createForClass(Gender)