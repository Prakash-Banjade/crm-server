import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";

const sortBy = {
    name: "course.name",
    createdAt: "course.createdAt",
}

export class CourseQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: sortBy, default: sortBy.createdAt })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => sortBy[value] || sortBy.createdAt)
    sortBy: string = sortBy.createdAt;

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    intakes?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    programLevels?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    categoryNames?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    countryNames?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => value.split(','))
    universityIds?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split('|'); // split by | because, universities name can have comma(,) which break downs the university name and no data is returned
        return []
    })
    universityNames?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        const num = +value;
        if (isNaN(num)) return undefined;
        return num;
    })
    courseDurationFrom?: number | undefined;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        const num = +value;
        if (isNaN(num)) return undefined;
        return num;
    })
    courseDurationTo?: number | undefined;

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (value) return value.split(',');
        return []
    })
    requirements?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ieltsOverall: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ieltsMinScore: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    pteOverall: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    minWorkExperience: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    feeFrom: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    feeTo: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    currency: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    grade12_percentage: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    ug_percentage: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    highestLevelOfEducation: string;
}