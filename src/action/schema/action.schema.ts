import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type ActionDocument = HydratedDocument<Actions>

@Schema()
export class Actions {
    @Prop()
    name:string
}

export const ActionSchema = SchemaFactory.createForClass(Actions);