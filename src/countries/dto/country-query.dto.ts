import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";

const sortBy = {
    name: "country.name",
    createdAt: "country.createdAt",
}

export class CountryQueryDto extends QueryDto {
    @ApiPropertyOptional({ enum: sortBy, default: sortBy.createdAt })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => sortBy[value] || sortBy.createdAt)
    sortBy: string = sortBy.createdAt;
}