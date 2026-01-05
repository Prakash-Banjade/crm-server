import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationRecipient } from './entities/notification-recipient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationRecipient
    ])
  ],
})
export class NotificationRecipientsModule { }
