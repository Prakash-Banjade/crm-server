import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { AccountsModule } from 'src/auth-system/accounts/accounts.module';
import { StudentsHelperService } from './students-helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student
    ]),
    AccountsModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsHelperService],
})
export class StudentsModule { }
