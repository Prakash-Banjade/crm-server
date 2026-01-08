import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Matches, ValidateIf } from "class-validator";
import { NAME_REGEX, NAME_WITH_SPACE_REGEX } from "src/common/CONSTANTS";
import { ECounselorType } from "../entities/counselor.entity";

export class CreateCounselorDto {
    @ApiProperty({ type: "string", description: 'Student first name' })
    @IsString()
    @IsNotEmpty()
    @Matches(NAME_REGEX, {
        message: 'Name can have only alphabets'
    })
    firstName: string;

    @ApiProperty({ type: "string", description: 'Student last name' })
    @IsString()
    @IsNotEmpty()
    @Matches(NAME_WITH_SPACE_REGEX, {
        message: 'Seems like invalid last name'
    })
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsPhoneNumber(undefined, { message: "Invalid phone number. Remember to use country code" })
    phoneNumber: string;

    @ApiProperty({ enum: ECounselorType })
    @IsEnum(ECounselorType)
    type: ECounselorType;

    /**
    |--------------------------------------------------
    | PERMISSIONs
    |--------------------------------------------------
    */

    @ApiPropertyOptional({ type: Boolean, default: false })
    @IsBoolean()
    @IsNotEmpty()
    @ValidateIf(o => o.type === ECounselorType.Application)
    seeAndReceiveApplicationNotifications: boolean;

    @ApiPropertyOptional({ type: Boolean, default: false })
    @IsBoolean()
    @IsNotEmpty()
    @ValidateIf(o => o.type === ECounselorType.Application)
    exportApplicationToExcelFile: boolean;

    @ApiPropertyOptional({ type: Boolean, default: false })
    @IsBoolean()
    @IsNotEmpty()
    @ValidateIf(o => o.type === ECounselorType.Application)
    showCommissionInfo: boolean

    @ApiPropertyOptional({ type: Boolean, default: false })
    @IsBoolean()
    @IsNotEmpty()
    @ValidateIf(o => o.type === ECounselorType.Application)
    reassignStudents: boolean;

    @ApiPropertyOptional({ type: Boolean, default: false })
    @IsBoolean()
    @IsNotEmpty()
    @ValidateIf(o => o.type === ECounselorType.Application)
    hideSensitiveChatContent: boolean;

    @ApiPropertyOptional({ type: Boolean, default: false })
    @IsBoolean()
    @IsNotEmpty()
    @ValidateIf(o => o.type === ECounselorType.Application)
    hideCommissionFromPromotionalContent: boolean;
}
