import { Module } from '@nestjs/common';
import { SupportChatMessagesService } from './support-chat-messages.service';
import { SupportChatMessagesController } from './support-chat-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportChatMessage } from './entities/support-chat-message.entity';
import { AccountsModule } from 'src/auth-system/accounts/accounts.module';
import { SupportChatModule } from '../support-chat/support-chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportChatMessage]),
    AccountsModule,
    SupportChatModule
  ],
  controllers: [SupportChatMessagesController],
  providers: [SupportChatMessagesService],
})
export class SupportChatMessagesModule { }
