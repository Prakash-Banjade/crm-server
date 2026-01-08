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
    @Transform(({ value }) => value?.split(',') || [])
    intakes?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => value?.split(',') || [])
    requirements?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => value?.split(',') || [])
    programLevels?: string[];

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => value?.split(',') || [])
    universityIds?: string[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    min_duration: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    max_duration: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    min_fee: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    max_fee: string;


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
    country: string[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    grade12: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    ug: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    ielts: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    pte: string;
}