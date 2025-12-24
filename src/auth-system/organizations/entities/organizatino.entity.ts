import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { Account } from "src/auth-system/accounts/entities/account.entity";
import { type OrganizationBankingDetail } from "../interface";
import { BaseEntity } from "src/common/entities/base.entity";

@Entity()
export class Organization extends BaseEntity {
    @Index()
    @Column('text')
    name: string;

    @Column('text')
    address: string;

    @Column('text')
    concerningPersonName: string;

    @Index({ unique: true })
    @Column('text')
    email: string;

    @Column('text')
    contactNumber: string;

    @Column('text')
    vatNumber: string;

    @Column('int')
    panNumber: number;

    // @OneToOne(() => File, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'panCertificate' })
    // panCertificate: File;

    // @OneToOne(() => File, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'registrationDocumentId' })
    // registrationDocument: File;

    @Column('jsonb')
    bankingDetails: OrganizationBankingDetail;

    // @OneToOne(() => File, { nullable: true, onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'logo-id' })
    // logo: File;

    @Column('text', { nullable: true })
    brandColorPrimary: string;

    @Column('text', { nullable: true })
    brandColorSecondary: string;

    @Column('text', { nullable: true })
    websiteUrl?: string;

    @OneToMany(() => Account, account => account.organization)
    accounts: Account[];

    @ManyToOne(() => Account, account => account.createdOrganizations, { nullable: false, onDelete: 'RESTRICT' })
    createdBy: Account;
}
