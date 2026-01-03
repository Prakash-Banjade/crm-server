import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CategoriesModule } from '../categories/categories.module';
import { UniversitiesModule } from 'src/universities/universities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
    ]),
    CategoriesModule,
    UniversitiesModule
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule { }
