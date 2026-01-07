import { Account } from "src/auth-system/accounts/entities/account.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { SupportChatMessage } from "src/support-chat-system/support-chat-messages/entities/support-chat-message.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity()
export class SupportChat extends BaseEntity {
    @OneToOne(() => Account, Account => Account.supportChat, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn()
    account: Account;

    @OneToMany(() => SupportChatMessage, (message) => message.supportChat)
    messages: SupportChatMessage[]
}