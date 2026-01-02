import { BaseEntity } from "src/common/entities/base.entity";
import { Student } from "src/students/entities/student.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity()
export class Application extends BaseEntity {
    @ManyToOne(() => Student, student => student.applications, { onDelete: 'CASCADE', nullable: false })
    student: Student;
}
