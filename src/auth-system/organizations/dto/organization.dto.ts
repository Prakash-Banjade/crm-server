import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { type OrganizationBankingDetail } from "../interface";
import { Type } from "class-transformer";
import { IsMinioUrl } from "src/common/decorators/validators/isMinioUrl";

class BankingDetails implements OrganizationBankingDetail {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bankName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bankLocation: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bankState: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bankCity: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    benificiaryName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    swiftCode?: string;
}

export class CreateOrganizationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contactNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    concerningPersonName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    vatNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    panNumber: string;

    @ApiProperty({ type: BankingDetails })
    @ValidateNested()
    @Type(() => BankingDetails)
    @IsDefined()
    bankingDetails: BankingDetails;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    websiteUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    brandColorPrimary?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    brandColorSecondary?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    panCertificate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    registrationDocument?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) { }