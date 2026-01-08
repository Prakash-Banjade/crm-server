import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { SupportChat } from "./entities/support-chat.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/auth-system/accounts/entities/account.entity";
import { Role } from "src/common/types";
import { QueryDto } from "src/common/dto/query.dto";
import { SupportChatMessage } from "../support-chat-messages/entities/support-chat-message.entity";
import { paginatedRawData } from "src/utils/paginatedData";

@Injectable()
export class SupportChatService {
    constructor(
        @InjectRepository(SupportChat) private readonly supportChatsRepo: Repository<SupportChat>,
    ) { }

    private async create(account: Account): Promise<SupportChat> {
        /** Super admin are not allowed to create chat */
        if (account.role === Role.SUPER_ADMIN) throw new ForbiddenException("Cannot create chat.")

        const supportChat = this.supportChatsRepo.create({ account });
        return this.supportChatsRepo.save(supportChat);
    }

    getAll(queryDto: QueryDto) {
        const queryBuilder = this.supportChatsRepo.createQueryBuilder("chat")
            .limit(queryDto.take)
            .offset(queryDto.skip)
            // subquery gets latest message per chat
            .leftJoin(
                qb => {
                    return qb
                        .subQuery()
                        .select("msg.supportChatId", "supportchatid")     // lowercase
                        .addSelect("msg.createdAt", "latestcreatedat")    // lowercase
                        .addSelect("msg.seenAt", "latestseenat")    // lowercase
                        .addSelect("msg.senderId", "latestmessagesenderid")    // lowercase
                        .from(SupportChatMessage, "msg")
                        .where(qb2 => {
                            const sub = qb2
                                .subQuery()
                                .select("MAX(inner.createdAt)")
                                .from(SupportChatMessage, "inner")
                                .where("inner.supportChatId = msg.supportChatId")
                                .getQuery();
                            return "msg.createdAt = " + sub;
                        });
                },
                "lm", // alias of the derived table
                "lm.supportchatid = chat.id"  // must match alias casing
            )
            .leftJoin("chat.account", "account")
            .leftJoin("account.organization", "organization")
            .select([
                'chat.id as id',
                'account.id as "senderId"',
                'account.lowerCasedFullName as sender',
                'account.role as "senderRole"',
                'organization.id as "organizationId"',
                'organization.name as "organizationName"',
                'lm.latestcreatedat as "latestMessageCreatedAt"',
                'lm.latestseenat as "latestMessageSeenAt"',
                'lm.latestmessagesenderid as "latestMessageSenderId"',
            ])
            .orderBy("lm.latestcreatedat", "DESC")

        return paginatedRawData(queryDto, queryBuilder);
    }

    /**
     * @param account 
     * @returns Promise<SupportChat>
     * @description Gets the support chat for the given account or creates a new one if it doesn't exist
     */
    async get(account: Account): Promise<SupportChat> {
        const supportChat = await this.supportChatsRepo.findOne({
            where: { account },
            select: { id: true }
        });

        if (supportChat) return supportChat;

        return this.create(account);
    }

    async findOne(id: string): Promise<SupportChat> {
        const existing = await this.supportChatsRepo.findOne({
            where: { id },
            relations: {
                account: { organization: true },
            },
            select: {
                id: true,
                account: {
                    id: true,
                    lowerCasedFullName: true,
                    role: true,
                    organization: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        if (!existing) throw new NotFoundException("Support chat not found");

        return existing;
    }

    async getById(id: string): Promise<SupportChat> {
        const existing = await this.supportChatsRepo.findOne({
            where: { id },
            select: { id: true }
        });

        if (!existing) throw new NotFoundException("Support chat not found");

        return existing;
    }
}