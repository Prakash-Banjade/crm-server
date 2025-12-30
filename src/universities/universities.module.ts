import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([University]),
    CountriesModule
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
})
export class UniversitiesModule { }
