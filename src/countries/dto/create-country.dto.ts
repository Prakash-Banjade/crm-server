import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCountryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    flag: string;

    @ApiProperty({ type: [String], isArray: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @Transform(({ value }) => Array.from(new Set(value))) // Remove duplicates
    states: string[];
}
