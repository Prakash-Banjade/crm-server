import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, IsUUID, Max, Min } from "class-validator";
import { ECourseRequirement, EMonth, EProgramLevel, type IRichText } from "src/common/types";

export class CreateCourseDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsObject()
    @IsDefined()
    description: IRichText;

    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    categoryId: string;

    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    universityId: string;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0, { message: 'Fee cannot be less than 0' })
    fee: number;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0, { message: 'Application fee cannot be less than 0' })
    applicationFee: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    currency: string;

    @ApiProperty({ type: [String], isArray: true })
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    commissions: string[]

    @ApiProperty({ type: [String], enum: EMonth, isArray: true })
    @IsNotEmpty({ each: true })
    @IsEnum(EMonth, { each: true })
    intakes: EMonth[];

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    @Max(9)
    ieltsOverall: number = 0;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    @Max(9)
    ieltsMinScore: number = 0;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    @Max(90)
    pteOverall: number = 0;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    @Max(90)
    pteMinScore: number = 0;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    @Max(90)
    minWorkExperience: number = 0;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    gapAccepted: number = 0; // years

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    @Max(100)
    minGrade12Percentage: number = 0;

    @ApiProperty({ type: Number })
    @IsNumber()
    @Min(0)
    @Max(100)
    minUgPercentage: number = 0;

    @ApiProperty()
    @IsUrl()
    courseUrl: string;

    @ApiProperty({ type: [String], isArray: true })
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    paymentTerms: string[]

    @ApiProperty({ description: 'Duration in months' })
    @IsNumber()
    @Min(1, { message: 'Duration cannot be less than 1 month' })
    duration: number;

    @ApiProperty({ type: [String], isArray: true })
    @IsEnum(ECourseRequirement, { each: true })
    requirements: ECourseRequirement[];

    @ApiProperty({ enum: EProgramLevel })
    @IsEnum(EProgramLevel)
    programLevel: EProgramLevel;

    @ApiPropertyOptional({ type: Boolean })
    @IsBoolean()
    @IsOptional()
    hasScholarship: boolean;
}
