import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subjects, SubjectSchema } from './schema/subject.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Subjects.name,
    schema:SubjectSchema
  }])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
