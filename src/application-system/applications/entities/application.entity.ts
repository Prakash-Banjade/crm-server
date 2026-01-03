import { BaseEntity } from "src/common/entities/base.entity";
import { EMonth } from "src/common/types";
import { Student } from "src/students/entities/student.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, Unique } from "typeorm";
import { EApplicationPriority, EApplicationStatus } from "../interface";
import { Course } from "src/course-system/courses/entities/course.entity";
import { Account } from "src/auth-system/accounts/entities/account.entity";
import { Conversation } from "src/application-system/conversations/entities/conversation.entity";

@Entity()
@Unique(['student', 'course', 'year', 'intake'])
export class Application extends BaseEntity {
    @Index()
    @ManyToOne(() => Student, student => student.applications, { onDelete: 'CASCADE', nullable: false })
    student: Student;

    @Index({ unique: true })
    @Column({ type: 'text' })
    ackNo: string;

    @Index()
    @Column({ type: 'int' })
    year: number

    @Index()
    @Column({ type: 'enum', enum: EMonth })
    intake: EMonth;

    @Column({ type: 'enum', enum: EApplicationPriority, default: EApplicationPriority.Medium })
    priority: EApplicationPriority;

    @Column({ type: 'enum', enum: EApplicationStatus, default: EApplicationStatus.Application_In_Progress })
    status: EApplicationStatus;

    @Index()
    @ManyToOne(() => Course, course => course.applications, { nullable: false, onDelete: "RESTRICT" })
    course: Course;

    @Column({ type: 'text', nullable: true })
    paymentDocument: string | null;

    @ManyToOne(() => Account, account => account.createdApplications, { onDelete: 'SET NULL', nullable: true })
    createdBy: Account | null

    @OneToMany(() => Conversation, conversation => conversation.application, { cascade: true })
    conversations: Conversation[]
}
