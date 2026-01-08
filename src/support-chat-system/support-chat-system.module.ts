import { Module } from '@nestjs/common';
import { SupportChatModule } from './support-chat/support-chat.module';
import { SupportChatMessagesModule } from './support-chat-messages/support-chat-messages.module';

@Module({
  imports: [SupportChatModule, SupportChatMessagesModule]
})
export class SupportChatSystemModule { }
