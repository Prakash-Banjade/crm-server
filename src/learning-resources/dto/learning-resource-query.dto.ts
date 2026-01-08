import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";

export class LearningResourceQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    parentId?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    description?: boolean = false;
}