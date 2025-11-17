import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Category } from './category.schema'
import { Status } from './status.schema'
import { Location } from './location.schema'
import { Users } from 'src/users/schema/users.schema'
import { SubCategory } from 'src/contable/schema/sub-category.schema'
import { Contable } from 'src/contable/schema/contable.schema'

export type ActivosDocument = HydratedDocument<Activos>

@Schema({ timestamps: true })
export class Activos {

  @Prop({ required: true, minlength: 4, maxlength: 16, trim: true })
  code: string

  @Prop({ required: true, minlength: 2, maxlength: 50, trim: true })
  name: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true })
  location: Location

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
  responsable: Users

  @Prop({ required: true, min: 0 })
  price_a: number

  @Prop({ type: Date, required: true })
  date_a: Date

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true })
  status: Status

  @Prop({ trim: true })
  imageUrl?: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contable', required: true })
  category: Contable

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' })
  subcategory?: SubCategory

  @Prop()
  description?: string

  @Prop({type:Boolean, default:true})
  disponibilidad:boolean

}

export const ActivosSchema = SchemaFactory.createForClass(Activos)
