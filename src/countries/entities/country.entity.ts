import { BaseEntity } from "src/common/entities/base.entity";
import { University } from "src/universities/entities/university.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";

@Entity()
export class Country extends BaseEntity {
    @Index({ unique: true })
    @Column("text")
    name: string;

    @Column("text")
    flag: string; // file name

    @Column("text", { array: true })
    states: string[];

    @OneToMany(() => University, (university) => university.country)
    universities: University[]
}
