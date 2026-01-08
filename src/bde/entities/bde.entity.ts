import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { Account } from "src/auth-system/accounts/entities/account.entity";

@Entity()
export class Bde extends BaseEntity {
    @OneToOne(() => Account, account => account.bde, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn()
    account: Account;

    @Column('text')
    phoneNumber: string;
}
