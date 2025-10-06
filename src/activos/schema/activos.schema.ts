import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Mongoose } from "mongoose";
import { Category } from "./category.schema";
import { Status } from "./status.schema";
import { Location } from "./location.schema";
import { Users } from "src/users/schema/users.schema";


export type ActivosDocument = HydratedDocument<Activos>

@Schema()
export class Activos {
    @Prop()
    code: string
    @Prop()
    name: string
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Location', required: true })
    location: Location
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Users', required: true })
    responsable:Users
    @Prop()
    price_a: number
    @Prop()
    date_a: string
    @Prop()
    date_e: string
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Status', required: true })
    status: Status
    @Prop()
    imageUrl: string
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Category', required: true })
    category:Category
    @Prop()
    description: string
}

export const ActivosSchema = SchemaFactory.createForClass(Activos);