import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";
import { EMonth } from "src/common/types";
import { EApplicationStatus } from "../interface";

export class ApplicationQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    createdFrom: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    createdTo: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    countryNames: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    universityNames: string[];

    @ApiPropertyOptional({ enum: EMonth })
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    }) // format: 'january,february,march'
    intakeMonths: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        const yearArr = value?.split(',')?.map((year: string) => isNaN(Number(year)) ? null : Number(year))?.filter(Boolean);
        return (Array.isArray(yearArr) && yearArr.length > 0) ? yearArr : [];
    })
    intakeYears: number[]

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    statuses: EApplicationStatus[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    courseName: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    studentName: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    studentId: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    ackNo: string;
}