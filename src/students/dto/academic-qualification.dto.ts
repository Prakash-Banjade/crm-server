import { ApiProperty } from "@nestjs/swagger";
import { EGradingSystem, ELevelOfEducation, IStudentAcademicQualification, IStudentLevelOfStudy } from "../interface";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateIf, ValidateNested } from "class-validator";
import { ECountry } from "src/common/types/country.type";
import { BadRequestException } from "@nestjs/common";
import { Type } from "class-transformer";

export class StudentLevelOfStudyDto implements IStudentLevelOfStudy {
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

    @ApiProperty({ enum: EGradingSystem })
    @IsEnum(EGradingSystem)
    gradingSystem: EGradingSystem;

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

export class LevelOfStudiesDto implements NonNullable<IStudentAcademicQualification["levelOfStudies"]> {
    @ApiProperty({ type: StudentLevelOfStudyDto })
    @ValidateNested()
    @Type(() => StudentLevelOfStudyDto)
    @IsOptional()
    [ELevelOfEducation.POSTGRADUATE]?: StudentLevelOfStudyDto;

    @ApiProperty({ type: StudentLevelOfStudyDto })
    @ValidateNested()
    @Type(() => StudentLevelOfStudyDto)
    @IsOptional()
    [ELevelOfEducation.UNDERGRADUATE]?: StudentLevelOfStudyDto;

    @ApiProperty({ type: StudentLevelOfStudyDto })
    @ValidateNested()
    @Type(() => StudentLevelOfStudyDto)
    @IsOptional()
    [ELevelOfEducation.Grade12]?: StudentLevelOfStudyDto;

    @ApiProperty({ type: StudentLevelOfStudyDto })
    @ValidateNested()
    @Type(() => StudentLevelOfStudyDto)
    @IsOptional()
    [ELevelOfEducation.Grade10]?: StudentLevelOfStudyDto;
}

export class StudentAcademicQualificationDto implements IStudentAcademicQualification {
    @ApiProperty({ enum: ECountry })
    @IsEnum(ECountry)
    countryOfEducation: ECountry;

    @ApiProperty({ enum: ELevelOfEducation })
    @IsEnum(ELevelOfEducation)
    highestLevelOfEducation: ELevelOfEducation;

    @ApiProperty({ type: LevelOfStudiesDto })
    @ValidateNested()
    @Type(() => LevelOfStudiesDto)
    @IsOptional()
    levelOfStudies?: LevelOfStudiesDto;
}
