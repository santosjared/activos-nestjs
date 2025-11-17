import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule} from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { Grade, GradeSchema } from './schema/grade.schema';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name:Users.name, schema:UsersSchema },
    { name:Grade.name, schema:GradeSchema },
    { name:Auth.name, schema:AuthSchema },
  ]),
  CaslModule,
],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
