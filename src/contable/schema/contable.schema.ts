import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { SubCategory } from "./sub-category.schema";

export type ContableDocument = HydratedDocument<Contable>

@Schema()
export class Contable {
    @Prop()
    name:string
    @Prop()
    util:number
    @Prop({type:[{type:mongoose.SchemaTypes.ObjectId, ref:'SubCategory'}]})
    subcategory:SubCategory[]
    @Prop()
    description?:string
}

export const ContableSchema = SchemaFactory.createForClass(Contable)