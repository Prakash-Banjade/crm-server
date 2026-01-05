import { BaseEntity } from "src/common/entities/base.entity";
import { NotificationRecipient } from "src/notification-system/notification-recipients/entities/notification-recipient.entity";
import { Column, Entity, OneToMany } from "typeorm";

export enum ENotificationType {
    APPLICATION_SUBMITTED = 'application_submitted',
    STUDENT_CREATED = 'student_created',
    APPLICATION_STATUS_MODIFIED = 'application_status_modified',
    CONVERSATION = 'conversation',
}

@Entity()
export class Notification extends BaseEntity {
    @Column({ type: 'enum', enum: ENotificationType })
    type: ENotificationType;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'varchar', length: 255 })
    url: string;

    @OneToMany(() => NotificationRecipient, (notificationRecipient) => notificationRecipient.notification, { cascade: true })
    notificationRecipients: NotificationRecipient[];
}
