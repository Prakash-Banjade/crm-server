import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { RegionalInchargesService } from './regional-incharges.service';
import { CreateRegionalInchargeDto } from './dto/create-regional-incharge.dto';
import { UpdateRegionalInchargeDto } from './dto/update-regional-incharge.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';

@ApiBearerAuth()
@ApiTags("Regional Incharges")
@Controller('regional-incharges')
export class RegionalInchargesController {
  constructor(private readonly regionalInchargesService: RegionalInchargesService) { }

  @Post()
  @ApiOperation({ summary: 'Create regional incharge' })
  @CheckAbilities({ action: Action.CREATE, subject: Role.SUPER_ADMIN })
  create(@Body() dto: CreateRegionalInchargeDto) {
    return this.regionalInchargesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all regional incharges' })
  @CheckAbilities({ action: Action.READ, subject: Role.SUPER_ADMIN })
  findAll(@Query() queryDto: QueryDto) {
    return this.regionalInchargesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get regional incharge by id' })
  @CheckAbilities({ action: Action.READ, subject: Role.SUPER_ADMIN })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionalInchargesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update regional incharge' })
  @CheckAbilities({ action: Action.UPDATE, subject: Role.SUPER_ADMIN })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRegionalInchargeDto) {
    return this.regionalInchargesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete regional incharge' })
  @CheckAbilities({ action: Action.DELETE, subject: Role.SUPER_ADMIN })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionalInchargesService.remove(id);
  }
}
