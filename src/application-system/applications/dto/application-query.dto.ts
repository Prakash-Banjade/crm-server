import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";
import { EMonth } from "src/common/types";
import { EApplicationPriority, EApplicationStatus } from "../interface";

export class ApplicationQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    dateFrom: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    dateTo: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        try {
            const val = JSON.parse(decodeURIComponent(value || "[]"))
            return val.map((item: { value: string }) => item.value).filter(Boolean)
        } catch (e) {
            return []
        }
    })
    university: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        try {
            const val = JSON.parse(decodeURIComponent(value || "[]"))
            return val.map((item: { value: string }) => item.value).filter(Boolean)
        } catch (e) {
            return []
        }
    })
    course: string[];

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
    @IsEnum(EApplicationStatus)
    status: EApplicationStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(EApplicationPriority)
    priority: EApplicationPriority;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    studentId: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    ackNo: string;
}