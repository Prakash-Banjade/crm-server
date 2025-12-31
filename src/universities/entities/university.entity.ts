import { BaseEntity } from "src/common/entities/base.entity";
import { type IRichText } from "src/common/types";
import { Country } from "src/countries/entities/country.entity";
import { Course } from "src/course-system/courses/entities/course.entity";
import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class University extends BaseEntity {
    @Index({ unique: true })
    @Column("text")
    name: string;

    @Index()
    @ManyToOne(() => Country, (country) => country.universities, { onDelete: 'CASCADE', nullable: false })
    country: Country

    @Column("text")
    state: string;

    @Column("text")
    commission: string;

    @Column("jsonb")
    description: IRichText;

    @OneToMany(() => Course, course => course.university)
    courses: Course[]
}
