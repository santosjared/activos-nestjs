import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type GradeDocument = HydratedDocument<Grade>

@Schema()
export class Grade {
    @Prop()
    name:string
}

export const GradeSchema = SchemaFactory.createForClass(Grade)