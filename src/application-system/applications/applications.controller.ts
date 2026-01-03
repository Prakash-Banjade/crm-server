import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Application } from './entities/application.entity';
import { Action, type AuthUser } from 'src/common/types';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { ApplicationQueryDto } from './dto/application-query.dto';

@ApiBearerAuth()
@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create application' })
  @CheckAbilities({ subject: Application, action: Action.CREATE })
  create(@Body() createApplicationDto: CreateApplicationDto, @CurrentUser() currentUser: AuthUser) {
    return this.applicationsService.create(createApplicationDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications' })
  @CheckAbilities({ subject: Application, action: Action.READ })
  findAll(@Query() queryDto: ApplicationQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.applicationsService.findAll(queryDto, currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(+id);
  }
}
