import { BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne, OneToMany, OneToOne } from "typeorm";
import bcrypt from "bcryptjs";
import { BadRequestException } from "@nestjs/common";
import { BaseEntity } from "src/common/entities/base.entity";
import { Role } from "src/common/types";
import { User } from "src/auth-system/users/entities/user.entity";
import { BCRYPT_HASH, EMAIL_REGEX, PASSWORD_SALT_COUNT } from "src/common/CONSTANTS";
import { WebAuthnCredential } from "src/auth-system/webAuthn/entities/webAuthnCredential.entity";
import { LoginDevice } from "./login-devices.entity";
import { getLowerCasedFullName } from "src/utils/utils";
import { Organization } from "src/auth-system/organizations/entities/organization.entity";
import { Counselor } from "src/counselors/entities/counselor.entity";
import { Bde } from "src/bde/entities/bde.entity";
import { Student } from "src/students/entities/student.entity";
import { Application } from "src/application-system/applications/entities/application.entity";
import { Message } from "src/application-system/messages/entities/message.entity";

@Entity()
export class Account extends BaseEntity {
    @Column({ type: 'text' })
    firstName!: string;

    @Column({ type: 'text', default: '' })
    lastName: string;

    @Index()
    @Column({ type: 'text' })
    lowerCasedFullName: string;

    setLowerCasedFullName() {
        this.lowerCasedFullName = getLowerCasedFullName(this.firstName, this.lastName || "");
    }

    @Index({ unique: true })
    @Column({ type: 'text' })
    email!: string;

    @Column({ type: 'text', nullable: true })
    password?: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @Column({ type: 'timestamp', nullable: true })
    verifiedAt: Date | null = null;

    @Column({ type: 'text', array: true })
    prevPasswords: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    passwordUpdatedAt: Date;

    @OneToMany(() => WebAuthnCredential, passkey => passkey.account)
    webAuthnCredentials: WebAuthnCredential[];

    @OneToMany(() => LoginDevice, loginDevice => loginDevice.account)
    loginDevices: LoginDevice[];

    @Column({ type: 'timestamp', nullable: true })
    twoFaEnabledAt: Date | null;

    @OneToOne(() => User, user => user.account, { nullable: true, cascade: true })
    user: User | null;

    @BeforeInsert()
    hashPassword() {
        if (this.password && !BCRYPT_HASH.test(this.password)) this.password = bcrypt.hashSync(this.password, PASSWORD_SALT_COUNT);
    }

    @BeforeInsert()
    @BeforeUpdate()
    validateEmail() {
        if (this.email && !EMAIL_REGEX.test(this.email)) throw new BadRequestException('Invalid email');
    }

    @Column({ type: 'text', nullable: true })
    profileImage: string | null;

    /**
     * Organization to which the account belongs
     */
    @ManyToOne(() => Organization, organization => organization.accounts, { onDelete: 'CASCADE' })
    organization: Organization;

    @OneToMany(() => Organization, organization => organization.createdBy)
    createdOrganizations: Organization[];

    @OneToOne(() => Counselor, counselor => counselor.account, { nullable: true, cascade: true })
    counselor: Counselor | null;

    @OneToMany(() => Counselor, counselor => counselor.createdBy)
    createdCounselors: Counselor[];

    @OneToOne(() => Bde, bde => bde.account, { nullable: true, cascade: true })
    bde: Bde | null;

    @OneToMany(() => Student, student => student.assignedTo)
    assignedStudents: Student[];

    @OneToMany(() => Student, student => student.createdBy)
    createdStudents: Student[];

    @OneToMany(() => Application, application => application.createdBy)
    createdApplications: Application[]

    @OneToMany(() => Message, message => message.sender)
    sentApplicationMessages: Message[]
}
