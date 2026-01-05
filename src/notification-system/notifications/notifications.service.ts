import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { DataSource, Not } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Notification } from './entities/notification.entity';
import { NotificationRecipient } from '../notification-recipients/entities/notification-recipient.entity';
import { Account } from 'src/auth-system/accounts/entities/account.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MailEvents } from 'src/mail/mail.service';
import { EnvService } from 'src/env/env.service';
import { BaseRepository } from 'src/common/repository/base-repository';
import { type FastifyRequest } from 'fastify';
import { AuthUser, Role } from 'src/common/types';
import { NotificationMailEvent } from 'src/mail/dto/events.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { paginatedRawData } from 'src/utils/paginatedData';

export const enum ENotificationEvent {
  CREATE = 'notification.create',
}

@Injectable({ scope: Scope.REQUEST })
export class NotificationsService extends BaseRepository {
  constructor(
    dataSource: DataSource, @Inject(REQUEST) req: FastifyRequest,
    private readonly eventEmitter: EventEmitter2,
    private readonly envService: EnvService,
  ) { super(dataSource, req) }

  @OnEvent(ENotificationEvent.CREATE)
  async create({ currentUser, ...createNotificationDto }: CreateNotificationDto) {
    if (currentUser.role === Role.SUPER_ADMIN || !currentUser.organizationId) return; // no need to create notification by super admin for any one

    const accounts = await this.getRecipients(currentUser);

    const notification = this.getRepository<Notification>(Notification).create({
      ...createNotificationDto,
      date: new Date(),
      notificationRecipients: accounts.map(account => this.getRepository<NotificationRecipient>(NotificationRecipient).create({
        recipient: account,
      }))
    });

    await this.getRepository<Notification>(Notification).save(notification);

    this.eventEmitter.emit(MailEvents.SEND_NOTIFICATION, new NotificationMailEvent({
      description: createNotificationDto.description || "",
      emails: accounts.map(account => account.email),
      title: createNotificationDto.title,
      url: this.envService.CLIENT_URL + createNotificationDto.url,
    }))

    return { message: 'Notification created' };
  }

  async getRecipients(currentUser: AuthUser): Promise<Account[]> {
    const accounts = await this.getRepository(Account).find({
      where: [
        {
          email: Not(currentUser.email), // no need to send notification to self
          organization: { id: currentUser.organizationId },
          role: Role.ADMIN
        },
        {
          email: Not(currentUser.email), // no need to send notification to self
          role: Role.SUPER_ADMIN, // for super admin
        }
      ],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organization: {
          id: true,
          name: true
        }
      }
    });

    return accounts;
  }

  async findAll(queryDto: QueryDto, currentUser: AuthUser) {
    const queryBuilder = this.getRepository(Notification).createQueryBuilder('notification')
      .innerJoin('notification.notificationRecipients', 'notificationRecipients', 'notificationRecipients.recipientId = :accountId', { accountId: currentUser.accountId })

    const notificationsQueryBuilder = queryBuilder.clone()
      .offset(queryDto.skip)
      .limit(queryDto.take)
      .orderBy('notification.createdAt', queryDto.order)
      .select([
        'notification.id as id',
        'notification.type as type',
        'notification.url as url',
        'notification.date as date',
        'notification.title as title',
        'notification.description as description',
        'notification.createdAt as "createdAt"',
        'notificationRecipients.seenAt as "seenAt"',
      ]);

    return paginatedRawData(queryDto, notificationsQueryBuilder);
  }

  findOne(id: string, currentUser: AuthUser) {
    const existing = this.getRepository<Notification>(Notification).findOne({
      where: {
        id,
        notificationRecipients: {
          recipient: { id: currentUser.accountId }
        }
      },
    })
    if (!existing) throw new NotFoundException('Notification not found')

    return existing;
  }

  async seen(id: string, currentUser: AuthUser): Promise<void> {
    const notificationReceipient = await this.getRepository(NotificationRecipient).findOne({
      where: {
        notification: { id },
        recipient: { id: currentUser.accountId }
      },
      select: { id: true }
    });

    if (!notificationReceipient) return;

    await this.getRepository(NotificationRecipient).update(notificationReceipient.id, { seenAt: new Date() });

    return;
  }

  async getCounts(currentUser: AuthUser) {
    const notifications = await this.getRepository(Notification)
      .createQueryBuilder('notification')
      .innerJoin(
        'notification.notificationRecipients',
        'notificationRecipients',
        'notificationRecipients.recipientId = :accountId',
        { accountId: currentUser.accountId },
      )
      .select([
        `COALESCE(COUNT(notification.id), 0) as "totalCount"`,
        `COALESCE(
         COUNT(DISTINCT CASE WHEN notificationRecipients.seenAt IS NULL
           THEN notificationRecipients.id END
         ),
         0
       ) as "unreadCount"`
      ])
      .getRawOne()

    return {
      totalCount: +notifications.totalCount,
      unreadCount: +notifications.unreadCount,
    };

  }
}
