import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument} from "mongoose";
import { Activos } from "src/activos/schema/activos.schema";
import { Location } from "src/activos/schema/location.schema";
import { Users } from "src/users/schema/users.schema";

export type EntregaDocument = HydratedDocument<Entrega>

@Schema()
export class Entrega  {
    @Prop()
    date:string
    @Prop()
    time:string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Users'})
    user_en:Users
    @Prop()
    user_rec:string
    @Prop({type:mongoose.SchemaTypes.ObjectId, ref:'Location'})
    location:Location
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'Activos'}]})
    activos:Activos[]
}

export const EntregaSchema = SchemaFactory.createForClass(Entrega);