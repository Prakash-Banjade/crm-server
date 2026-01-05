import { Notification } from "src/notification-system/notifications/entities/notification.entity";
import { Account } from "src/auth-system/accounts/entities/account.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";

@Entity()
export class NotificationRecipient extends BaseEntity {
    @ManyToOne(() => Notification, (notification) => notification.notificationRecipients, { onDelete: 'CASCADE' })
    notification: Notification;

    @Column({ type: 'timestamp', nullable: true })
    seenAt: Date;

    @ManyToOne(() => Account, (account) => account.receivedNotifications, { onDelete: 'CASCADE' })
    recipient: Account;
}
