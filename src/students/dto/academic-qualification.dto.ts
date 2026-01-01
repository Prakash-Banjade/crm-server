import { ApiProperty } from "@nestjs/swagger";
import { ELevelOfEducation, IStudentAcademicQualification, IStudentLevelOfStudy } from "../interface";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min, ValidateIf, ValidateNested } from "class-validator";
import { ECountry } from "src/common/types/country.type";
import { BadRequestException } from "@nestjs/common";
import { Type } from "class-transformer";

export class StudentLevelOfStudyDto implements IStudentLevelOfStudy {
    @ApiProperty({ enum: ELevelOfEducation })
    @IsEnum(ELevelOfEducation)
    levelOfStudy: ELevelOfEducation;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Name of board must be less than 100 characters' })
    nameOfBoard: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Name of institution must be less than 100 characters' })
    nameOfInstitution: string;

    @ApiProperty({ enum: ECountry })
    @IsEnum(ECountry)
    country: ECountry;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'State must be less than 100 characters' })
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'City must be less than 100 characters' })
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Degree awarded must be less than 100 characters' })
    degreeAwarded: string;

    @ApiProperty()
    @IsNumber()
    @Min(0, { message: 'Score must be a positive number' })
    score: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Primary language must be less than 100 characters' })
    primaryLanguage: string;

    @ApiProperty()
    @IsDateString()
    startDate: string;

    @ApiProperty()
    @IsDateString()
    @ValidateIf((o: StudentLevelOfStudyDto) => {
        if (!o.startDate || !o.endDate) throw new BadRequestException('Start date and end date are required');
        if (new Date(o.endDate) < new Date(o.startDate)) throw new BadRequestException('End date must be greater than start date');
        return true;
    })
    endDate: string;
}

export class StudentAcademicQualificationDto implements IStudentAcademicQualification {
    @ApiProperty({ enum: ECountry })
    @IsEnum(ECountry)
    countryOfEducation: ECountry;

    @ApiProperty({ enum: ELevelOfEducation })
    @IsEnum(ELevelOfEducation)
    highestLevelOfEducation: ELevelOfEducation;

    @ApiProperty({ type: StudentLevelOfStudyDto, isArray: true })
    @ValidateNested({ each: true })
    @Type(() => StudentLevelOfStudyDto)
    levelOfStudies: StudentLevelOfStudyDto[];
}
