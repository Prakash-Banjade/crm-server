import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Action, Role, type AuthUser } from 'src/common/types';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.CREATE })
  create(@Body() dto: CreateMessageDto, @CurrentUser() currentUser: AuthUser) {
    return this.messagesService.create(dto, currentUser);
  }

  @Get(":conversationId")
  @ApiOperation({ summary: 'Get all messages' })
  @CheckAbilities({ subject: Role.COUNSELOR, action: Action.READ })
  findAll(@Param("conversationId", ParseUUIDPipe) conversationId: string, @CurrentUser() currentUser: AuthUser) {
    return this.messagesService.findAll(conversationId, currentUser);
  }
}
