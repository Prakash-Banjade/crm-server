import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMaxSize, IsArray, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateIf } from "class-validator";

export class CreateMessageDto {
    @ApiProperty()
    @IsUUID()
    conversationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(250, { message: 'Content must be at most 250 characters' })
    @ValidateIf((dto: CreateMessageDto) => dto.files?.length === 0)
    content: string;

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsArray()
    @ArrayMaxSize(3, { message: 'Files array can have at most 3 elements' })
    @ValidateIf((dto: CreateMessageDto) => dto.content?.length === 0)
    files: string[] = [];
}
