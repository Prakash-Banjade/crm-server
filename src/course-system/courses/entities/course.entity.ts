import { BaseEntity } from "src/common/entities/base.entity";
import { University } from "src/universities/entities/university.entity";
import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import { ECourseRequirement, EMonth, EProgramLevel, type IRichText } from "src/common/types";
import { Category } from "src/course-system/categories/entities/category.entity";
import { Application } from "src/application-system/applications/entities/application.entity";

@Entity()
export class Course extends BaseEntity {
    @Index()
    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'jsonb' })
    description: IRichText;

    @ManyToOne(() => Category, category => category.courses, { onDelete: 'RESTRICT', nullable: false })
    category: Category;

    @ManyToOne(() => University, university => university.courses, { onDelete: 'RESTRICT', nullable: false })
    university: University;

    @OneToMany(() => Application, application => application.course)
    applications: Application[]

    @Column({ type: 'float' })
    fee: number;

    @Column({ type: 'float', default: 0 })
    applicationFee: number;

    @Column({ type: 'text' })
    currency: string;

    @Column({ type: 'text', array: true })
    commissions: string[]
    // eg: [1 to 5 Students: 12%, 6 to 15 Students:15.5 %, Above 15 Students: 19%]

    @Column({ type: 'float', default: 0 })
    ieltsOverall: number;

    @Column({ type: 'float', default: 0 })
    ieltsMinScore: number;

    @Column({ type: 'float', default: 0 })
    pteOverall: number;

    @Column({ type: 'float', default: 0 })
    pteMinScore: number;

    @Column({ type: 'float', default: 0 })
    minWorkExperience: number;

    @Column({ type: 'float', default: 0 })
    gapAccepted: number; // years

    @Column({ type: 'float', default: 0 })
    minGrade12Percentage: number;

    @Column({ type: 'float', default: 0 })
    minUgPercentage: number;

    @Column({ type: 'text' })
    courseUrl: string;

    @Column({ type: 'text', array: true })
    paymentTerms: string[]

    @Column({ type: 'float' })
    duration: number;

    @Column({ type: 'enum', array: true, enum: ECourseRequirement })
    requirements: ECourseRequirement[];

    @Column({ type: 'enum', enum: EProgramLevel, default: EProgramLevel.High_School })
    programLevel: EProgramLevel;

    @Index({ parser: 'gin' })
    @Column({ type: 'enum', enum: EMonth, array: true })
    intakes: EMonth[];

    @Column({ type: 'boolean', default: false })
    hasScholarship: boolean;
}
