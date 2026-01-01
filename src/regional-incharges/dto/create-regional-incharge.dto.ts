import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateRegionalInchargeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
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
}
