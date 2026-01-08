import { Conversation } from "src/application-system/applications/entities/conversation.entity";
import { Account } from "src/auth-system/accounts/entities/account.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Message extends BaseEntity {
    @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: 'CASCADE', nullable: false })
    conversation: Conversation;

    @ManyToOne(() => Account, account => account.sentApplicationMessages, { onDelete: 'CASCADE', nullable: false })
    sender: Account;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'text', array: true })
    files: string[]
}
