import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type locationDocument = HydratedDocument<Location>

@Schema()
export class Location {
    @Prop()
    name:string
}

export const LocationSchema = SchemaFactory.createForClass(Location);