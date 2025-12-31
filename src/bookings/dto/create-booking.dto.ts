import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, IsUUID, Matches, MaxLength } from "class-validator";
import { NAME_WITH_SPACE_REGEX } from "src/common/CONSTANTS";
import { IsDateOfBirth } from "src/common/decorators/validators/isDateOfBrith.decorator";
import { IsFutureDate } from "src/common/decorators/validators/isFutureDate.decorator";
import { EBookingSubType, EBookingType } from "src/common/types";

export class CreateBookingDto {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(NAME_WITH_SPACE_REGEX, { message: 'Invalid name' })
    @MaxLength(100, { message: 'Name must be at most 100 characters' })
    name: string;

    @ApiProperty()
    @IsDateOfBirth(8, 80, { message: 'Invalid date of birth' })
    dob: string;

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsEnum(EBookingType)
    type: EBookingType

    @ApiProperty()
    @IsEnum(EBookingSubType)
    subType: EBookingSubType

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    location: string;

    @ApiProperty()
    @IsPhoneNumber()
    phNo: string;

    @ApiProperty()
    @IsFutureDate()
    bookingDate: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    passportAttachment: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    paymentProof: string;
}
