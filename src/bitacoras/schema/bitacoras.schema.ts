import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Users } from "src/users/schema/users.schema";


export type BitacorasDocument = HydratedDocument<Bitacoras>

@Schema({timestamps:true})

export class Bitacoras {
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    user:Users
    @Prop()
    action:string
    @Prop()
    method:string
    @Prop()
    logs:string
}

export const BitacorasSchema = SchemaFactory.createForClass(Bitacoras)