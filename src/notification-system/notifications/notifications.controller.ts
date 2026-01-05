import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, type AuthUser, Role } from 'src/common/types';
import { QueryDto } from 'src/common/dto/query.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
    ) { }

    @Get()
    @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
    findAll(@Query() queryDto: QueryDto, @CurrentUser() currentUser: AuthUser) {
        return this.notificationsService.findAll(queryDto, currentUser);
    }

    @Get('counts')
    @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
    getCounts(@CurrentUser() currentUser: AuthUser) {
        return this.notificationsService.getCounts(currentUser);
    }

    @Get(':id')
    @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
    findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
        return this.notificationsService.findOne(id, currentUser);
    }

    @Patch(':id/seen')
    @HttpCode(HttpStatus.OK)
    @CheckAbilities({ subject: Role.COUNSELOR, action: Action.UPDATE })
    updateSeen(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
        return this.notificationsService.seen(id, currentUser);
    }
}
