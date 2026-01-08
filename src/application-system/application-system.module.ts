import { Module } from '@nestjs/common';
import { ApplicationsModule } from './applications/applications.module';
import { MessagesModule } from './messages/messages.module';

@Module({
    imports: [
        ApplicationsModule,
        MessagesModule,
    ]
})
export class ApplicationSystemModule { }
