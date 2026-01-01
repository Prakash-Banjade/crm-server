import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { EApplicationStatus } from "src/applications/interface";
import { QueryDto } from "src/common/dto/query.dto";
import { EMonth } from "src/common/types";

const sortBy = {
    name: "student.fullName",
    createdAt: "student.createdAt",
}

export class StudentQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: sortBy, default: sortBy.createdAt })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => sortBy[value] || sortBy.createdAt)
    sortBy: string = sortBy.createdAt;

    @ApiPropertyOptional({ format: 'date-time' })
    @IsString()
    @IsOptional()
    createdFrom: string;

    @ApiPropertyOptional({ format: 'date-time' })
    @IsString()
    @IsOptional()
    createdTo: string;

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
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    countryIds: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    universityIds: string[];
}