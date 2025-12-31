import { Module } from '@nestjs/common';
import { LearningResourcesService } from './learning-resources.service';
import { LearningResourcesController } from './learning-resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningResource } from './entities/learning-resource.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LearningResource
    ])
  ],
  controllers: [LearningResourcesController],
  providers: [LearningResourcesService],
})
export class LearningResourcesModule { }
