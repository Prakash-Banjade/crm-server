import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { LearningResourcesService } from './learning-resources.service';
import { CreateLearningResourceDto } from './dto/create-learning-resource.dto';
import { UpdateLearningResourceDto } from './dto/update-learning-resource.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';
import { LearningResourceQueryDto } from './dto/learning-resource-query.dto';

@ApiBearerAuth()
@ApiTags("Learning resources")
@Controller('learning-resources')
export class LearningResourcesController {
  constructor(private readonly learningResourcesService: LearningResourcesService) { }

  @Post()
  @ApiOperation({ description: 'Create learning resource' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.CREATE })
  create(@Body() dto: CreateLearningResourceDto) {
    return this.learningResourcesService.create(dto);
  }

  @Get()
  @ApiOperation({ description: 'Get all learning resources' })
  findAll(@Query() queryDto: LearningResourceQueryDto) {
    return this.learningResourcesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get learning resource by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.learningResourcesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update learning resource' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLearningResourceDto) {
    return this.learningResourcesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete learning resource' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.learningResourcesService.remove(id);
  }
}
