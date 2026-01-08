import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';
import { QueryDto } from 'src/common/dto/query.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.CREATE })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findAll(@Query() queryDto: QueryDto) {
    return this.categoriesService.findAll(queryDto);
  }

  @Get('options')
  @ApiOperation({ summary: 'Get all categories options' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  getOptions(@Query() queryDto: QueryDto) {
    return this.categoriesService.getOptions(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by id' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
