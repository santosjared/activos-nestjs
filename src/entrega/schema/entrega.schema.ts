import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument} from "mongoose";
import { Activos } from "src/activos/schema/activos.schema";
import { Location } from "src/activos/schema/location.schema";
import { Grade } from "src/users/schema/grade.schema";
import { Users } from "src/users/schema/users.schema";

export type EntregaDocument = HydratedDocument<Entrega>

@Schema({timestamps:true})
export class Entrega  {
    @Prop()
    code:string
    @Prop()
    date:string
    @Prop()
    time:string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    user_rec:Users
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    user_en:Users
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Location'})
    location:Location
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'Activos'}]})
    activos:Activos[]
    @Prop()
    documentUrl?:string
    @Prop()
    description?:string
}

export const EntregaSchema = SchemaFactory.createForClass(Entrega);