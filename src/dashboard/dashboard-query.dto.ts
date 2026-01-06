import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { EApplicationStatus } from "src/application-system/applications/interface";
import { QueryDto } from "src/common/dto/query.dto";

export class DashboardQueryDto extends QueryDto {
    @ApiPropertyOptional({ format: 'date-time' })
    @IsDateString()
    @IsOptional()
    dateFrom: string;

    @ApiPropertyOptional({ format: 'date-time' })
    @IsDateString()
    @IsOptional()
    dateTo: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (value) return value.split(',')
        return []
    })
    countryNames: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (value) return value.split(',')
        return []
    })
    intakeMonths: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (value) return value.split(',')
        return []
    })
    intakeYears: string[];

    @ApiPropertyOptional()
    @IsEnum(EApplicationStatus)
    @IsOptional()
    applicationStatus: EApplicationStatus;
}