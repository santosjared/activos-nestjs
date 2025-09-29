import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Mongoose } from "mongoose";
import { Category } from "./category.schema";


export type ActivosDocument = HydratedDocument<Activos>

@Schema()
export class Activos {
    @Prop()
    code: string
    @Prop()
    name: string
    @Prop()
    location: string
    @Prop()
    price_a: number
    @Prop()
    lote:string
    @Prop()
    cantidad:number
    @Prop()
    date_a: string
    @Prop()
    date_e: string
    @Prop({type:String, default:'disponible'})
    status: string
    @Prop()
    imageUrl: string
    @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Category', required: true })
    category:Category
    @Prop()
    otherCategory:String
}

export const ActivosSchema = SchemaFactory.createForClass(Activos);