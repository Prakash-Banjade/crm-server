import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity()
export class File extends BaseEntity {
    @Index({ unique: true })
    @Column({ type: 'text' })
    url!: string

    @Column({ type: 'text' })
    mimeType!: string

    @Column({ type: 'text' })
    format!: string

    @Column({ type: 'int' })
    size!: number

    @Column({ type: 'text' })
    originalName!: string

    @Column({ type: 'text', default: '' })
    name!: string

    /**
    |--------------------------------------------------
    | RELATIONS
    |--------------------------------------------------
    */
}
