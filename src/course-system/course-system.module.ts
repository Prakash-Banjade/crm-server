import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    CoursesModule,
    CategoriesModule
  ]
})
export class CourseSystemModule { }
