import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EModeOfSalary, IStudentWorkExperience } from "../interface";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";
import { BadRequestException } from "@nestjs/common";

export class StudentWorkExperienceDto implements IStudentWorkExperience {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Organization must be less than 100 characters' })
    organization: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Position must be less than 100 characters' })
    position: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Job profile must be less than 100 characters' })
    jobProfile: string;

    @ApiProperty()
    @IsDateString()
    workingFrom: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    @ValidateIf((o: StudentWorkExperienceDto) => {
        if (!o.workingFrom) throw new BadRequestException('Working from is required');
        if (o.workingTo && new Date(o.workingTo) < new Date(o.workingFrom)) throw new BadRequestException('Working to must be greater than working from');
        return true;
    })
    workingTo?: string;

    @ApiProperty({ enum: EModeOfSalary })
    @IsEnum(EModeOfSalary)
    modeOfSalary: EModeOfSalary;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(250, { message: 'Comment must be less than 250 characters' })
    comment?: string;
}
