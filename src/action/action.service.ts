import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ActionDocument, Actions } from './schema/action.schema';
import { Model } from 'mongoose';

@Injectable()
export class ActionService {
  constructor(@InjectModel(Actions.name)private readonly actionService:Model<ActionDocument>){}
  async create(createActionDto: CreateActionDto) {
    return await this.actionService.create(createActionDto);
  }

  async findAll() {
    return await this.actionService.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} action`;
  }

  update(id: number, updateActionDto: UpdateActionDto) {
    return `This action updates a #${id} action`;
  }

  remove(id: number) {
    return `This action removes a #${id} action`;
  }
}
