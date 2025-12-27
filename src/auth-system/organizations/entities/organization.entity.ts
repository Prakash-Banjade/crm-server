import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
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

    // @OneToOne(() => File, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'panCertificate' })
    // panCertificate: File;

    // @OneToOne(() => File, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'registrationDocumentId' })
    // registrationDocument: File;

    @Column('jsonb', { nullable: false })
    bankingDetails: OrganizationBankingDetail;

    // @OneToOne(() => File, { nullable: true, onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'logo-id' })
    // logo: File;

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
    blackListedAt: Date | null;
}
