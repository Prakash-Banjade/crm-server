import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, type AuthUser, Role } from 'src/common/types';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { OrganizationQueryDto } from './dto/organization-query.dto';

@ApiBearerAuth()
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create new organization' })
  @ApiOkResponse({ description: 'Successfully created organization' })
  @ApiNotFoundResponse({ description: 'Associated account not found' })
  @ApiConflictResponse({ description: 'Duplicate organization name or email found' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.CREATE })
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() currentUser: AuthUser) {
    return this.organizationsService.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiOkResponse({ description: 'Successfully received organizations' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findAll(@Query() queryDto: OrganizationQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.organizationsService.findAll(queryDto, currentUser);
  }

  @Get('options')
  @ApiOperation({ summary: 'Get all organizations options' })
  @ApiOkResponse({ description: 'Successfully received organizations options' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  getOptions(@Query() queryDto: OrganizationQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.organizationsService.getOptions(queryDto, currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by id' })
  @ApiOkResponse({ description: 'Successfully received organization' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id/toggle-block')
  @ApiOperation({ summary: 'Toggle block organization by id' })
  @ApiOkResponse({ description: 'Successfully toggled block organization' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  toggleBlock(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.toggleBlock(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization by id' })
  @ApiOkResponse({ description: 'Successfully updated organization' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiConflictResponse({ description: 'Duplicate organization name or email found' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization by id' })
  @ApiOkResponse({ description: 'Successfully deleted organization' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.DELETE })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.delete(id);
  }
}
