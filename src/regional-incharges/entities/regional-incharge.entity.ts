import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class RegionalIncharge extends BaseEntity {
    @Column("text")
    name: string;

    @Column("text", { unique: true })
    email: string;

    @Column("text", { unique: true })
    phone: string;

    @Column("text", { nullable: true })
    profileImage: string | null;
}
