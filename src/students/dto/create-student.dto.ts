import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsPhoneNumber, Matches, ValidateNested } from "class-validator";
import { NAME_REGEX, NAME_WITH_SPACE_REGEX } from "src/common/CONSTANTS";
import { StudentDocumentsDto, StudentPersonalInfoDto } from "./personal-info.dto";
import { StudentAcademicQualificationDto } from "./academic-qualification.dto";
import { StudentWorkExperienceDto } from "./work-experience.dto";

export class CreateStudentDto {
    @ApiProperty()
    @Matches(NAME_REGEX, { message: 'First name must be a valid name' })
    firstName: string;

    @ApiProperty()
    @Matches(NAME_WITH_SPACE_REGEX, { message: 'Last name can only contain letters and spaces' })
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsPhoneNumber(undefined, { message: 'Invalid phone number. Remember to use country code' })
    phoneNumber: string;

    @ApiPropertyOptional({ type: StudentPersonalInfoDto })
    @ValidateNested()
    @Type(() => StudentPersonalInfoDto)
    @IsOptional()
    personalInfo?: StudentPersonalInfoDto;

    @ApiPropertyOptional({ type: StudentAcademicQualificationDto })
    @ValidateNested()
    @Type(() => StudentAcademicQualificationDto)
    @IsOptional()
    academicQualification?: StudentAcademicQualificationDto;

    @ApiPropertyOptional({ type: StudentWorkExperienceDto, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => StudentWorkExperienceDto)
    @IsOptional()
    workExperiences?: StudentWorkExperienceDto[];

    @ApiPropertyOptional({ type: StudentDocumentsDto })
    @ValidateNested()
    @Type(() => StudentDocumentsDto)
    @IsOptional()
    documents?: StudentDocumentsDto;
}
