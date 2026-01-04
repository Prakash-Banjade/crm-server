import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { AuthUser, Role } from 'src/common/types';
import { AccountsService } from 'src/auth-system/accounts/accounts.service';
import { Conversation } from '../applications/entities/conversation.entity';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation) private readonly conversationRepo: Repository<Conversation>,
    private readonly accountsService: AccountsService,
    private readonly minioService: MinioService,
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
      select: { id: true }
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
        sender: true
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
        }
      }
    });
  }
}
