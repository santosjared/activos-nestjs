import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SubCateGoryDocument = HydratedDocument<SubCategory>

@Schema()
export class SubCategory {
    @Prop()
    name:string
    @Prop()
    util:number
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory)