import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./entities/notification.entity";

export class NotificationsCron {
    constructor(
        @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
    ) { }

    /**
     * removing notifications that is seen by all recipients
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async removeOldNotifications() {
        console.log('Removing old notifications...');

        const oldNotifications = await this.notificationRepo.createQueryBuilder('notification')
            .leftJoin('notification.notificationRecipients', 'notificationRecipients')
            .where('DATE(notification.createdAt) < DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)')
            .groupBy('notification.id')
            .having('COUNT(notificationRecipients.id) = COUNT(notificationRecipients.seenAt)')
            .select(['notification.id'])
            .getMany()

        this.notificationRepo.remove(oldNotifications);
    }
}