import { BaseEntity } from "src/common/entities/base.entity";
import { EBookingStatus, EBookingSubType, EBookingType } from "src/common/types";
import { Column, Entity, Index } from "typeorm";

@Entity()
export class Booking extends BaseEntity {
    @Index()
    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'timestamp' })
    dob: string;

    @Column({ type: 'text' })
    email: string

    @Column({ type: 'enum', enum: EBookingType })
    type: EBookingType;

    @Column({ type: 'enum', enum: EBookingSubType })
    subType: EBookingSubType

    @Column({ type: 'text' })
    location: string;

    @Column({ type: 'text' })
    phNo: string;

    @Column({ type: 'timestamp' })
    bookingDate: string;

    @Column({ type: 'text' })
    passportAttachment: string; // file

    @Column({ type: 'text' })
    paymentProof: string; // file

    @Column({ type: 'enum', enum: EBookingStatus, default: EBookingStatus.PENDING })
    status: EBookingStatus;
}
