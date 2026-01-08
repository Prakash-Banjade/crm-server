import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table", {
    closureTableName: "learningResources_closure",
    ancestorColumnName: (column) => "ancestor_" + column.propertyName,
    descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class LearningResource extends BaseEntity {
    @Index()
    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text', array: true })
    files: string[]; // files

    @TreeChildren()
    children: LearningResource[];

    @TreeParent({ onDelete: "CASCADE" })
    parent: LearningResource | null;
}