import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type AuthDocument = HydratedDocument<Auth>;

@Schema({timestamps:true, autoIndex: false })
export class Auth {
    @Prop({ required: true, unique: false})
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'Rol', required:true}]})
    roles:Types.ObjectId[];

    @Prop()
    fullName:string;

    @Prop({ default:false})
    isActive:boolean; 

    @Prop({default:false})
    isRoot:boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);