import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubjectDocument, Subjects } from './schema/subject.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubjectService {
  constructor(@InjectModel(Subjects.name)private readonly subjectService:Model<SubjectDocument>){}
  async create(createSubjectDto: CreateSubjectDto) {
    return await this.subjectService.create(createSubjectDto);
  }

  async findAll() {
    return await this.subjectService.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
