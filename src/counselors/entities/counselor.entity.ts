import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { Account } from "src/auth-system/accounts/entities/account.entity";

export enum ECounselorType {
    Application = 'application',
    Commission = 'commission',
}

@Entity()
export class Counselor extends BaseEntity {
    @OneToOne(() => Account, account => account.counselor, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn()
    account: Account;

    @Column('text')
    phoneNumber: string;

    @Column({ type: 'enum', enum: ECounselorType, default: ECounselorType.Application })
    type: ECounselorType

    @ManyToOne(() => Account, account => account.createdCounselors, { onDelete: 'SET NULL' })
    createdBy: Account | null;

    /**
    |--------------------------------------------------
    | PERMISSIONS
    |--------------------------------------------------
    */

    @Column({ type: 'boolean', default: false })
    seeAndReceiveApplicationNotifications: boolean;

    @Column({ type: 'boolean', default: false })
    exportApplicationToExcelFile: boolean;

    @Column({ type: 'boolean', default: false })
    showCommissionInfo: boolean

    @Column({ type: 'boolean', default: false })
    reassignStudents: boolean;

    @Column({ type: 'boolean', default: false })
    hideSensitiveChatContent: boolean;

    @Column({ type: 'boolean', default: false })
    hideCommissionFromPromotionalContent: boolean;
}
