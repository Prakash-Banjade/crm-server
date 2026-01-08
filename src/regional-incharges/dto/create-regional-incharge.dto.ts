import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches } from "class-validator";
import { NAME_WITH_SPACE_REGEX } from "src/common/CONSTANTS";

export class CreateRegionalInchargeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(NAME_WITH_SPACE_REGEX, { message: "Invalid name" })
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsPhoneNumber(undefined, { message: "Invalid phone number. Remember to use country code" })
    phone: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    profileImage?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    role?: string;
}
