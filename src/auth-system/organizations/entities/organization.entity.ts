import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Account } from "src/auth-system/accounts/entities/account.entity";
import { type OrganizationBankingDetail } from "../interface";
import { BaseEntity } from "src/common/entities/base.entity";

@Entity()
export class Organization extends BaseEntity {
    @Index({ unique: true })
    @Column('text')
    name: string;

    @Column('text', { default: "" })
    address: string;

    @Column('text', { default: "" })
    concerningPersonName: string;

    @Index({ unique: true })
    @Column('text')
    email: string;

    @Column('text', { default: "" })
    contactNumber: string;

    @Column('text', { default: "" })
    vatNumber: string;

    @Column('text', { default: "" })
    panNumber: string;

    @Column('text', { nullable: true })
    panCertificate: string | null; // file

    @Column('text', { nullable: true })
    registrationDocument: string | null; // file

    @Column('jsonb', { nullable: false })
    bankingDetails: OrganizationBankingDetail;

    @Column('text', { nullable: true })
    logo: string | null; // file

    @Column('text', { default: "" })
    brandColorPrimary: string;

    @Column('text', { default: "" })
    brandColorSecondary: string;

    @Column('text', { default: "" })
    websiteUrl: string;

    @OneToMany(() => Account, account => account.organization)
    accounts: Account[];

    @ManyToOne(() => Account, account => account.createdOrganizations, { nullable: true, onDelete: 'RESTRICT' })
    createdBy: Account | null;

    @Column({ type: 'timestamp', nullable: true })
    blacklistedAt: Date | null;
}
