import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Actions } from "src/action/schema/action.schema";

export type SubjectDocument = HydratedDocument<Subjects>

@Schema()
export class Subjects {
    @Prop()
    name: string

    _id?: string
}

export const SubjectSchema = SchemaFactory.createForClass(Subjects);