import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationRecipientsModule } from './notification-recipients/notification-recipients.module';

@Module({
  imports: [
    NotificationsModule,
    NotificationRecipientsModule
  ]
})
export class NotificationSystemModule { }
