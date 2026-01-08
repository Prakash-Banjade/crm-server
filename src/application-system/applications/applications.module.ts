import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { StudentsModule } from 'src/students/students.module';
import { CoursesModule } from 'src/course-system/courses/courses.module';
import { AccountsModule } from 'src/auth-system/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    StudentsModule,
    CoursesModule,
    AccountsModule
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule { }
