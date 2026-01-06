import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Action, Role, type AuthUser } from 'src/common/types';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('counts')
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
  getCounts(@CurrentUser() currentUser: AuthUser) {
    return this.dashboardService.getCounts(currentUser);
  }

  @Get('application-pipeline')
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
  getApplicationPipeline(@CurrentUser() currentUser: AuthUser) {
    return this.dashboardService.getApplicationPipeline(currentUser);
  }

}
