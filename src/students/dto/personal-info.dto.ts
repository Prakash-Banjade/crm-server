import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength, Min, ValidateIf, ValidateNested } from "class-validator";
import type { IStudentAddress, IStudentBackgroundInfo, IStudentDocuments, IStudentEmergencyContact, IStudentNationality, IStudentPassport, IStudentPersonalInfo } from "../interface";
import { ECountry } from "src/common/types/country.type";
import { BadRequestException } from "@nestjs/common";
import { IsDateOfBirth } from "src/common/decorators/validators/isDateOfBrith.decorator";
import { EGender, EMaritalStatus } from "src/common/types";
import { Type } from "class-transformer";
import { IsFutureDate } from "src/common/decorators/validators/isFutureDate.decorator";

export class StudentDocumentsDto implements IStudentDocuments {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    cv: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gradeTenMarksheet: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    gradeElevenMarksheet?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gradeTwelveMarksheet: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passport: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ielts: string;

    @ApiProperty()
    @IsString({ each: true })
    @IsNotEmpty()
    @ArrayMaxSize(2, { message: 'Recommendation letters must be less than 2' })
    @ArrayMinSize(1, { message: 'At least one recommendation letter is required' })
    recommendationLetters: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    workExperience?: string;
}

export class StudentAddressDto implements IStudentAddress {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(250, { message: 'Address 1 must be less than 250 characters' })
    address1: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(250, { message: 'Address 2 must be less than 250 characters' })
    address2?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'City must be less than 100 characters' })
    city: string;

    @ApiProperty()
    @IsEnum(ECountry)
    country: ECountry;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'State must be less than 100 characters' })
    state: string;

    @ApiProperty()
    @IsNumber()
    @Min(0, { message: 'Zip code must be a positive number' })
    zipCode: number;
}


export class StudentPassportDto implements IStudentPassport {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20, { message: 'Passport number must be less than 20 characters' })
    number: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    issueDate: string;

    @ApiProperty()
    @IsFutureDate()
    @IsNotEmpty()
    @ValidateIf((o: StudentPassportDto) => {
        if (!o.issueDate || !o.expiryDate) throw new BadRequestException('Passport issue date and expiry date are required');
        if (new Date(o.expiryDate) < new Date(o.issueDate)) throw new BadRequestException('Passport expiry date must be greater than issue date');
        return true;
    })
    expiryDate: string;

    @ApiProperty({ enum: ECountry })
    @IsEnum(ECountry)
    issueCountry: ECountry;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'City of birth must be less than 100 characters' })
    cityOfBrith: string;

    @ApiProperty({ enum: ECountry })
    @IsEnum(ECountry)
    countryOfBrith: ECountry;
}

export class StudentNationalityDto implements IStudentNationality {
    // @ApiProperty({ enum: ECountry })
    // @IsEnum(ECountry)
    // nationality: ECountry;

    // @ApiProperty({ enum: ECountry })
    // @IsEnum(ECountry)
    // citizenship: ECountry;

    @ApiProperty({ enum: ECountry })
    @IsEnum(ECountry)
    livingAndStudyingCountry: ECountry;

    @ApiPropertyOptional({ enum: ECountry, isArray: true })
    @IsOptional()
    @IsEnum(ECountry, { each: true })
    otherCountriesCitizenship?: ECountry[];
}

export class StudentBackgroundInfoDto implements IStudentBackgroundInfo {
    @ApiPropertyOptional({ enum: ECountry })
    @IsOptional()
    @IsEnum(ECountry)
    appliedImmigrationCountry?: ECountry;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @MaxLength(250, { message: 'Medical condition must be less than 250 characters' })
    medicalCondition?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @MaxLength(500, { message: 'Visa refusal must be less than 500 characters' })
    visaRefusal?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(250, { message: 'Criminal record must be less than 250 characters' })
    criminalRecord?: string;
}

export class StudentEmergencyContactDto implements IStudentEmergencyContact {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Name must be less than 100 characters' })
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Relationship must be less than 100 characters' })
    relationship: string;

    @ApiProperty()
    @IsPhoneNumber(undefined, { message: 'Invalid emergency phone number. Remember to use country code' })
    phoneNumber: string;

    @ApiProperty()
    @IsEmail()
    email: string;
}

export class StudentPersonalInfoDto implements IStudentPersonalInfo {
    @ApiProperty()
    @IsDateOfBirth(16, 80, { message: 'Invalid date of birth. Student must be between 16 and 80 years old' })
    dob: string;

    @ApiProperty({ enum: EGender })
    @IsEnum(EGender)
    gender: EGender;

    @ApiProperty({ enum: EMaritalStatus })
    @IsEnum(EMaritalStatus)
    maritalStatus: EMaritalStatus;

    @ApiProperty({ type: StudentAddressDto })
    @ValidateNested()
    @Type(() => StudentAddressDto)
    @IsOptional()
    mailingAddress?: StudentAddressDto;

    @ApiProperty({ type: StudentAddressDto })
    @ValidateNested()
    @Type(() => StudentAddressDto)
    @IsOptional()
    permanentAddress?: StudentAddressDto;

    @ApiProperty({ type: StudentPassportDto })
    @ValidateNested()
    @Type(() => StudentPassportDto)
    @IsOptional()
    passport?: StudentPassportDto;

    @ApiProperty({ type: StudentNationalityDto })
    @ValidateNested()
    @Type(() => StudentNationalityDto)
    @IsOptional()
    nationality?: StudentNationalityDto;

    @ApiProperty({ type: StudentBackgroundInfoDto })
    @ValidateNested()
    @Type(() => StudentBackgroundInfoDto)
    @IsOptional()
    backgroundInfo?: StudentBackgroundInfoDto;

    @ApiProperty({ type: StudentEmergencyContactDto })
    @ValidateNested()
    @Type(() => StudentEmergencyContactDto)
    @IsOptional()
    emergencyContact?: StudentEmergencyContactDto;
}
