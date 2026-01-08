import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Action, Role, type AuthUser } from 'src/common/types';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { DashboardQueryDto } from './dashboard-query.dto';

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
  getApplicationPipeline(@Query() queryDto: DashboardQueryDto, @CurrentUser() currentUser: AuthUser) {
    return this.dashboardService.getApplicationPipeline(queryDto, currentUser);
  }

  @Get('support-chat-messages')
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.READ })
  getRecentSupportChatMessages() {
    return this.dashboardService.getRecentSupportChatMessages();
  }

}
