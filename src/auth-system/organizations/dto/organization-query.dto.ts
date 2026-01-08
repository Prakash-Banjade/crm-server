import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";

const sortBy = {
    name: "organization.name",
    createdAt: "organization.createdAt",
}

export class OrganizationQueryDto extends QueryDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => sortBy[value] || sortBy.createdAt)
    sortBy: string = sortBy.createdAt;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    createdById?: string;
}