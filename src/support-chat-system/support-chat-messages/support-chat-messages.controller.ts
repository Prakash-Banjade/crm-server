import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { SupportChatMessagesService } from './support-chat-messages.service';
import { CreateSupportChatMessageDto } from './dto/create-support-chat-message.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Action, Role, type AuthUser } from 'src/common/types';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportChatMessagesQueryDto } from './dto/support-chat-message-query.dto';

@ApiBearerAuth()
@ApiTags("Support Chat Messages")
@Controller('support-chat-messages')
export class SupportChatMessagesController {
  constructor(private readonly supportChatMessagesService: SupportChatMessagesService) { }

  @Post()
  @ApiOperation({ summary: "Create support chat message" })
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.CREATE })
  create(@Body() dto: CreateSupportChatMessageDto, @CurrentUser() user: AuthUser) {
    return this.supportChatMessagesService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: "Get all support chat messages" })
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
  findAll(@Query() queryDto: SupportChatMessagesQueryDto, @CurrentUser() user: AuthUser) {
    return this.supportChatMessagesService.findAll(queryDto, user);
  }

  /** Only for super admin, seenAt is the column to track super admin's seen status */
  @Patch(':id/seen')
  @ApiOperation({ summary: "Mark support chat message as seen" })
  @CheckAbilities({ subject: Role.SUPER_ADMIN, action: Action.UPDATE })
  markAsSeen(@Param('id', ParseUUIDPipe) messageId: string) {
    return this.supportChatMessagesService.markAsSeen(messageId);
  }
}
