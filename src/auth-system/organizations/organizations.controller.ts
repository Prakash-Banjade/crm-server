import { Controller, Get, Query } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryDto } from 'src/common/dto/query.dto';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, Role } from 'src/common/types';

@ApiBearerAuth()
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Get('options')
  @ApiOperation({ summary: 'Get all organizations options' })
  @ApiOkResponse({ description: 'Successfully received organizations options' })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  getOptions(@Query() queryDto: QueryDto) {
    return this.organizationsService.getOptions(queryDto);
  }
}
