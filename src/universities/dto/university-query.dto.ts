import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";

const sortBy = {
    name: "university.name",
    createdAt: "university.createdAt",
}

export class UniversityQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: sortBy, default: sortBy.createdAt })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => sortBy[value] || sortBy.createdAt)
    sortBy: string = sortBy.createdAt;

    @ApiPropertyOptional({ type: String })
    @IsUUID()
    @IsOptional()
    countryId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    intake?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === "true")
    withCourseCount?: boolean = false;
}