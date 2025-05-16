import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Actions, ActionSchema } from './schema/action.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Actions.name,
    schema:ActionSchema
  }])],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
