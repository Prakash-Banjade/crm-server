import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupportChatMessageDto } from './dto/create-support-chat-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportChatMessage } from './entities/support-chat-message.entity';
import { IsNull, LessThanOrEqual, Repository } from 'typeorm';
import { AuthUser, Role } from 'src/common/types';
import { SupportChatService } from '../support-chat/support-chat.service';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { SupportChatMessagesQueryDto } from './dto/support-chat-message-query.dto';
import paginatedData from 'src/utils/paginatedData';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ENotificationEvent } from 'src/notification-system/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notification-system/notifications/dto/create-notification.dto';
import { ENotificationType } from 'src/notification-system/notifications/entities/notification.entity';

@Injectable()
export class SupportChatMessagesService {
  constructor(
    @InjectRepository(SupportChatMessage) private readonly supportChatMessagesRepo: Repository<SupportChatMessage>,
    private readonly supportChatService: SupportChatService,
    private readonly accountsService: AccountsService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(dto: CreateSupportChatMessageDto, currentUser: AuthUser) {
    const sender = await this.accountsService.getOrThrow(currentUser.accountId, { id: true, role: true, lowerCasedFullName: true });

    if (currentUser.role === Role.SUPER_ADMIN && !dto.supportChatId) throw new BadRequestException("Support chat ID is required");

    const supportChat = (currentUser.role === Role.SUPER_ADMIN && dto.supportChatId)
      ? await this.supportChatService.getById(dto.supportChatId)
      : await this.supportChatService.get(sender);

    const message = this.supportChatMessagesRepo.create({
      content: dto.content,
      sender,
      supportChat,
    });

    await this.supportChatMessagesRepo.save(message);

    if (currentUser.role !== Role.SUPER_ADMIN) {
      // send notification
      this.eventEmitter.emit(ENotificationEvent.CREATE, new CreateNotificationDto({
        title: 'New support request',
        type: ENotificationType.SUPPORT_CHAT_MESSAGE,
        description: `A new support request from ${currentUser.firstName} ${currentUser.lastName} of organization ${currentUser.organizationName}.`,
        url: `/support-chat/${supportChat.id}`,
        currentUser
      }));
    }

    return { message: "Sent" }
  }

  findAll(queryDto: SupportChatMessagesQueryDto, currentUser: AuthUser) {
    const queryBuilder = this.supportChatMessagesRepo.createQueryBuilder("message")
      .orderBy("message.createdAt", "DESC")
      .take(queryDto.take)
      .skip(queryDto.skip)
      .leftJoin('message.sender', 'sender');

    if (currentUser.role !== Role.SUPER_ADMIN) {
      queryBuilder
        .leftJoin('message.supportChat', 'supportChat')
        .where("supportChat.accountId = :accountId", { accountId: currentUser.accountId });
    }

    if (currentUser.role === Role.SUPER_ADMIN) {
      if (!queryDto.supportChatId) throw new BadRequestException("Support chat ID is required");
      queryBuilder.where("message.supportChatId = :supportChatId", { supportChatId: queryDto.supportChatId });
    }

    queryBuilder.select([
      'message.id',
      'message.content',
      'message.createdAt',
      'sender.id',
      'sender.lowerCasedFullName',
      'sender.role',
      'message.seenAt'
    ]);

    return paginatedData(queryDto, queryBuilder);
  }

  async markAsSeen(messageId: string) {
    const message = await this.supportChatMessagesRepo.findOne({
      where: { id: messageId },
      relations: { supportChat: true },
      select: { id: true, supportChat: { id: true } }
    });
    if (!message) throw new NotFoundException("Message not found");

    // mark all the messages of support chat which are not seen yet
    await this.supportChatMessagesRepo.update({
      supportChat: { id: message.supportChat.id },
      seenAt: IsNull(),
    }, {
      seenAt: new Date()
    });

    return { message: "Marked as seen" }
  }
}
