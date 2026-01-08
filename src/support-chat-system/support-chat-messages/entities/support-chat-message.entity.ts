import { Account } from "src/auth-system/accounts/entities/account.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { SupportChat } from "src/support-chat-system/support-chat/entities/support-chat.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity()
export class SupportChatMessage extends BaseEntity {
    @Index()
    @ManyToOne(() => SupportChat, supportChat => supportChat.messages, { onDelete: 'CASCADE', nullable: false })
    supportChat: SupportChat;

    @Column({ type: 'text' })
    content: string;

    @Index()
    @ManyToOne(() => Account, account => account.supportChatMessages, { onDelete: 'CASCADE', nullable: false })
    sender: Account;

    /** Only for super admin, seenAt is used to track super admin's seen status */
    @Column({ type: 'timestamp', nullable: true })
    seenAt: Date | null;
}
