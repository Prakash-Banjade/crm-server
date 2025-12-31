import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateLearningResourceDto {
    @ApiProperty({ type: String, description: 'Title of the learning resource' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ type: String, description: 'Description of the learning resource' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ type: 'string', description: 'Parent Id of the learning resource' })
    @IsUUID()
    @IsOptional()
    parentId?: string

    @ApiPropertyOptional({ type: 'string', description: 'File of the learning resource', isArray: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @IsOptional()
    files?: string[] = []
}