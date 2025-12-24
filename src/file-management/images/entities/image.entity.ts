import { Account } from "src/auth-system/accounts/entities/account.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Image extends BaseEntity {
    @Index({ unique: true })
    @Column({ type: 'text' })
    url!: string

    @Column({ type: 'text' })
    mimeType!: string

    @Column({ type: 'text' })
    format!: string

    @Column({ type: 'text' })
    space!: string

    @Column({ type: 'real' })
    height!: number

    @Column({ type: 'real' })
    width!: number

    @Column({ type: 'int' })
    size!: number

    @Column({ type: 'text' })
    originalName!: string

    @Column({ type: 'text', default: '' })
    name!: string

    @ManyToOne(() => Account, account => account.images, { onDelete: 'SET NULL', nullable: true })
    uploadedBy!: Account

    /**
    |--------------------------------------------------
    | RELATIONS
    |--------------------------------------------------
    */

    @OneToOne(() => Account, account => account.profileImage, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn()
    account_profileImage: Account;
}
