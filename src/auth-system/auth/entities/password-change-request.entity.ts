import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PasswordChangeRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    email: string;

    @Column('text')
    hashedResetToken: string;

    @Column('timestamp')
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    setCreatedAt() {
        this.createdAt = new Date();
    }
}