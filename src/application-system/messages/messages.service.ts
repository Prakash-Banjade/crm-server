import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { AuthUser, Role } from 'src/common/types';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { Conversation } from '../applications/entities/conversation.entity';
import { MinioService } from 'src/minio/minio.service';
import { CreateNotificationDto } from 'src/notification-system/notifications/dto/create-notification.dto';
import { ENotificationEvent } from 'src/notification-system/notifications/notifications.service';
import { ENotificationType } from 'src/notification-system/notifications/entities/notification.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation) private readonly conversationRepo: Repository<Conversation>,
    private readonly accountsService: AccountsService,
    private readonly minioService: MinioService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async create(dto: CreateMessageDto, currentUser: AuthUser) {
    const sender = await this.accountsService.getOrThrow(currentUser.accountId);

    const conversation = await this.conversationRepo.findOne({
      where: {
        id: dto.conversationId,
        application: {
          createdBy: {
            organization: { id: currentUser.role === Role.SUPER_ADMIN ? undefined : currentUser.organizationId }
          }
        }
      },
      relations: {
        application: {
          student: true
        }
      },
      select: { id: true, application: { id: true, student: { id: true, firstName: true, lastName: true } } }
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const files = dto.files.length > 0 ? await Promise.all(dto.files.map(file => this.minioService.moveFileToPermanent(file))) : [];

    const message = this.messageRepo.create({
      content: dto.content,
      files,
      conversation,
      sender,
    });

    await this.messageRepo.save(message);

    // create notifications
    const student = conversation.application?.student;

    this.eventEmitter.emit(ENotificationEvent.CREATE, new CreateNotificationDto({
      title: 'New conversation message',
      type: ENotificationType.CONVERSATION,
      url: `/students/application/${student?.id}?tab=applications&applicationId=${conversation.application?.id}`,
      description: `A message from ${currentUser.firstName} ${currentUser.lastName} of ${currentUser.organizationName} in application of ${student.firstName} ${student.lastName}`,
      currentUser
    }))

    return { message: "Message sent" }
  }

  findAll(conversationId: string, currentUser: AuthUser) {
    return this.messageRepo.find({
      where: {
        conversation: {
          id: conversationId,
          application: {
            createdBy: {
              organization: { id: currentUser.role === Role.SUPER_ADMIN ? undefined : currentUser.organizationId }
            }
          }
        }
      },
      relations: {
        sender: {
          organization: true
        }
      },
      select: {
        id: true,
        content: true,
        files: true,
        createdAt: true,
        sender: {
          id: true,
          lowerCasedFullName: true,
          role: true,
          createdAt: true,
          organization: {
            id: true,
            name: true,
          }
        }
      }
    });
  }
}
