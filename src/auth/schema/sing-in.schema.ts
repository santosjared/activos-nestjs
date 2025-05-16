import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type SingInDocument = HydratedDocument<SingIn>;

@Schema({timestamps:true})
export class SingIn {
    
    @Prop()
    userId:string
}

export const SingInSchema = SchemaFactory.createForClass(SingIn);