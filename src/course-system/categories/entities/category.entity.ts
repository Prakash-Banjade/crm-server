import { BaseEntity } from "src/common/entities/base.entity";
import { Course } from "src/course-system/courses/entities/course.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";

@Entity()
export class Category extends BaseEntity {
    @Index({ unique: true })
    @Column({ type: 'text' })
    name: string;

    @OneToMany(() => Course, course => course.category)
    courses: Course[]
}
