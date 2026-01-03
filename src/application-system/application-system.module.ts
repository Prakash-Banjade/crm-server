import { Module } from '@nestjs/common';
import { ApplicationsModule } from './applications/applications.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';

@Module({
    imports: [
        ApplicationsModule,
        ConversationsModule,
        MessagesModule,
    ]
})
export class ApplicationSystemModule { }
