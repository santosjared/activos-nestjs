import { Module } from '@nestjs/common';
import { ContableService } from './contable.service';
import { ContableController } from './contable.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contable, ContableSchema } from './schema/contable.schema';
import { SubCategory, SubCategorySchema } from './schema/sub-category.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Contable.name, schema:ContableSchema },
    { name:SubCategory.name, schema:SubCategorySchema },  
  ])],
  controllers: [ContableController],
  providers: [ContableService],
})
export class ContableModule {}
