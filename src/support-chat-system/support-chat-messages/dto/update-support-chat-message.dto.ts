import { PartialType } from '@nestjs/swagger';
import { CreateSupportChatMessageDto } from './create-support-chat-message.dto';

export class UpdateSupportChatMessageDto extends PartialType(CreateSupportChatMessageDto) { }
