import { Controller, Get, HttpCode, HttpStatus, MessageEvent, Param, Patch, Query, Sse } from '@nestjs/common';
import { ENotificationEvent, NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { Action, type AuthUser, Role } from 'src/common/types';
import { QueryDto } from 'src/common/dto/query.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { fromEvent, map, Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly eventEmitter: EventEmitter2
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

    @Sse('stream')
    @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ }) // Ensure auth
    stream(@CurrentUser() user: AuthUser): Observable<MessageEvent> {
        // Listen to the specific event for this user ID
        return fromEvent(this.eventEmitter, `${ENotificationEvent.PUSH_NOTIFICATION_EVENT}.${user.accountId}`).pipe(
            map((payload: any) => ({
                data: payload, // This payload will be sent to the frontend
            }))
        );
    }
}
