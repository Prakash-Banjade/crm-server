import { Account } from 'src/auth-system/accounts/entities/account.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne } from 'typeorm';
import type { IStudentAcademicQualification, IStudentAsLead, IStudentDocuments, IStudentPersonalInfo, IStudentWorkExperience } from '../interface';

@Entity()
export class Student extends BaseEntity {
    @Index({ unique: true })
    @Column({ type: 'text' })
    refNo: string;

    @Column({ type: 'text' })
    firstName: string;

    @Column({ type: 'text' })
    lastName: string;

    @BeforeInsert()
    @BeforeUpdate()
    setFullName() {
        this.fullName = `${this.firstName} ${this.lastName}`;
    }

    @Index()
    @Column({ type: 'text' })
    fullName: string;

    @Column({ type: 'text', nullable: true })
    profile: string | null; // file

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text' })
    phoneNumber: string;

    @ManyToOne(() => Account, account => account.assignedStudents, { onDelete: 'SET NULL', nullable: true })
    assignedTo: Account | null;

    @Column({ type: 'jsonb', nullable: true })
    personalInfo?: IStudentPersonalInfo;

    @Column({ type: 'jsonb', nullable: true })
    academicQualification?: IStudentAcademicQualification;

    @Column({ type: 'jsonb', nullable: true })
    workExperiences?: IStudentWorkExperience[];

    @Column({ type: 'jsonb', nullable: true })
    documents?: IStudentDocuments;

    @ManyToOne(() => Account, account => account.createdStudents, { onDelete: 'CASCADE' })
    createdBy: Account

    @Column({ type: 'jsonb', nullable: true })
    asLead?: IStudentAsLead;

    @Column({ type: 'text', default: "Personal info incomplete" })
    statusMessage: string;
}
