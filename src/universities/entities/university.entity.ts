import { BaseEntity } from "src/common/entities/base.entity";
import { type IRichText } from "src/common/types";
import { Country } from "src/countries/entities/country.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity()
export class University extends BaseEntity {
    @Index({ unique: true })
    @Column("text")
    name: string;

    @ManyToOne(() => Country, (country) => country.universities, { onDelete: 'CASCADE', nullable: false })
    country: Country

    @Column("text")
    state: string;

    @Column("text")
    commission: string;

    @Column("jsonb")
    description: IRichText;
}
