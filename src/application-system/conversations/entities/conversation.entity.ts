import { Application } from "src/application-system/applications/entities/application.entity";
import { EConversationType } from "src/application-system/applications/interface";
import { Message } from "src/application-system/messages/entities/message.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Conversation extends BaseEntity {
    @Column({ type: 'enum', enum: EConversationType })
    type: EConversationType;

    @ManyToOne(() => Application, application => application.conversations, { onDelete: 'CASCADE', nullable: false })
    application: Application;

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[]
}
