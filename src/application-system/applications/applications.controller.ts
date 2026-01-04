import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
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
  @CheckAbilities({ subject: Application, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: AuthUser) {
    return this.applicationsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @CheckAbilities({ subject: Application, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateApplicationDto: UpdateApplicationDto, @CurrentUser() currentUser: AuthUser) {
    return this.applicationsService.update(id, updateApplicationDto, currentUser);
  }

  @Delete(':id')
  @CheckAbilities({ subject: Application, action: Action.DELETE })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.applicationsService.remove(id);
  }
}
