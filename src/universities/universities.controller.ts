import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UniversityQueryDto } from './dto/university-query.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@ApiTags('Universities')
@ApiBearerAuth()
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new university' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.CREATE })
  create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all universities' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findAll(@Query() queryDto: UniversityQueryDto) {
    return this.universitiesService.findAll(queryDto);
  }

  @Get('options')
  @ApiOperation({ summary: 'Get all universities for select options' })
  getOptions(@Query() queryDto: UniversityQueryDto) {
    return this.universitiesService.getOptions(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a university by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.universitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a university by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUniversityDto) {
    return this.universitiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a university by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.universitiesService.remove(id);
  }
}
