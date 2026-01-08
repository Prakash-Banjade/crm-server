import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsObject, IsString, IsUUID, MaxLength } from "class-validator";
import { type IRichText } from "src/common/types";

export class CreateUniversityDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(300, { message: "Name must be at most 300 characters long" })
    name: string;

    @ApiProperty()
    @IsUUID()
    countryId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: "State must be at most 100 characters long" })
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000, { message: "Commission must be at most 1000 characters long" })
    commission: string;

    @ApiProperty()
    @IsObject()
    @IsDefined()
    description: IRichText;
}
